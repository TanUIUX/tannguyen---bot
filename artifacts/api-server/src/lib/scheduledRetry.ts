import { db, botLogsTable, ordersTable } from "@workspace/db";
import { or, eq, and } from "drizzle-orm";
import { deliverOrder, sendAdminAlert } from "./bot";
import { logger } from "./logger";

const RETRY_INTERVAL_MS = 20 * 60 * 1000;

const STUCK_STATUSES = ["needs_manual_action", "confirmed_not_delivered"] as const;
type StuckStatus = typeof STUCK_STATUSES[number];

let sweepRunning = false;

export async function runStuckOrderRetrySweep(): Promise<void> {
  if (sweepRunning) {
    logger.warn("Scheduled retry sweep skipped: previous sweep still running");
    return;
  }
  sweepRunning = true;
  try {
    const stuckOrders = await db
      .select({ id: ordersTable.id, orderCode: ordersTable.orderCode, status: ordersTable.status })
      .from(ordersTable)
      .where(or(...STUCK_STATUSES.map(s => eq(ordersTable.status, s))));

    await db.insert(botLogsTable).values({
      action: "scheduled_retry_sweep_started",
      content: `Scheduled retry sweep started: found ${stuckOrders.length} stuck order(s)`,
      metadata: { orderIds: stuckOrders.map(o => o.id), count: stuckOrders.length },
      level: "info",
    });

    if (stuckOrders.length === 0) {
      logger.info("Scheduled retry sweep: no stuck orders found");
      await db.insert(botLogsTable).values({
        action: "scheduled_retry_sweep_completed",
        content: "Scheduled retry sweep completed: no stuck orders found",
        metadata: { swept: 0, delivered: 0, failed: 0, errored: 0 },
        level: "info",
      });
      return;
    }

    logger.info({ count: stuckOrders.length }, "Scheduled retry sweep: attempting delivery for stuck orders");

    let delivered = 0;
    let failed = 0;
    let errored = 0;
    const deliveredCodes: string[] = [];
    const failedCodes: string[] = [];
    const erroredCodes: string[] = [];

    for (const { id: orderId, orderCode, status } of stuckOrders) {
      try {
        const previousStatus = status as StuckStatus;

        const [updated] = await db
          .update(ordersTable)
          .set({ status: "paid" })
          .where(and(eq(ordersTable.id, orderId), or(...STUCK_STATUSES.map(s => eq(ordersTable.status, s)))))
          .returning({ id: ordersTable.id });

        if (!updated) continue;

        let success: boolean;
        try {
          success = await deliverOrder(orderId);
        } catch (deliverErr) {
          logger.error({ err: deliverErr, orderId, orderCode }, "deliverOrder threw unexpectedly during sweep; restoring stuck status");

          await db
            .update(ordersTable)
            .set({ status: previousStatus })
            .where(and(eq(ordersTable.id, orderId), eq(ordersTable.status, "paid")));

          await db.insert(botLogsTable).values({
            action: "scheduled_retry_exception",
            content: `Scheduled retry for order ${orderCode} (id=${orderId}) threw an error: ${deliverErr instanceof Error ? deliverErr.message : String(deliverErr)}`,
            metadata: { orderId, orderCode, previousStatus, error: deliverErr instanceof Error ? deliverErr.message : String(deliverErr) },
            level: "error",
          });

          errored++;
          erroredCodes.push(orderCode);
          continue;
        }

        await db.insert(botLogsTable).values({
          action: success ? "scheduled_retry_delivered" : "scheduled_retry_failed",
          content: `Scheduled retry for order ${orderCode} (id=${orderId}): ${success ? "delivered" : "failed"}`,
          metadata: { orderId, orderCode, previousStatus },
          level: success ? "info" : "warn",
        });

        if (success) {
          delivered++;
          deliveredCodes.push(orderCode);
        } else {
          failed++;
          failedCodes.push(orderCode);
        }
      } catch (orderErr) {
        logger.error({ err: orderErr, orderId, orderCode }, "Unexpected error processing order during sweep");
        errored++;
        erroredCodes.push(orderCode);
      }
    }

    const summaryLines = [
      `🔄 <b>Quét định kỳ đơn hàng bị kẹt</b>`,
      ``,
      `📊 Tổng số đơn hàng bị kẹt: <b>${stuckOrders.length}</b>`,
      `✅ Giao thành công: <b>${delivered}</b>`,
      `❌ Thất bại (chưa đủ hàng): <b>${failed}</b>`,
      `⚠️ Lỗi ngoại lệ: <b>${errored}</b>`,
    ];

    if (deliveredCodes.length > 0) {
      summaryLines.push(``, `Đơn giao được: ${deliveredCodes.map(c => `<code>${c}</code>`).join(", ")}`);
    }
    if (failedCodes.length > 0) {
      summaryLines.push(``, `Đơn chưa giao được: ${failedCodes.map(c => `<code>${c}</code>`).join(", ")}`);
    }
    if (erroredCodes.length > 0) {
      summaryLines.push(``, `Đơn gặp lỗi (đã hoàn trạng thái): ${erroredCodes.map(c => `<code>${c}</code>`).join(", ")}`);
    }

    await sendAdminAlert(summaryLines.join("\n"), {
      swept: stuckOrders.length,
      delivered,
      failed,
      errored,
      deliveredCodes,
      failedCodes,
      erroredCodes,
    });

    await db.insert(botLogsTable).values({
      action: "scheduled_retry_sweep_completed",
      content: `Scheduled retry sweep completed: ${delivered} delivered, ${failed} failed, ${errored} errored out of ${stuckOrders.length} stuck order(s)`,
      metadata: { swept: stuckOrders.length, delivered, failed, errored },
      level: errored > 0 || failed > 0 ? "warn" : "info",
    });

    logger.info({ swept: stuckOrders.length, delivered, failed, errored }, "Scheduled retry sweep completed");
  } catch (err) {
    logger.error({ err }, "Scheduled retry sweep encountered an error");
    await db.insert(botLogsTable).values({
      action: "scheduled_retry_sweep_error",
      content: `Scheduled retry sweep error: ${err instanceof Error ? err.message : String(err)}`,
      metadata: { error: err instanceof Error ? err.message : String(err) },
      level: "error",
    }).catch(() => {});
  } finally {
    sweepRunning = false;
  }
}

export function startScheduledRetrySweep(): void {
  logger.info({ intervalMs: RETRY_INTERVAL_MS }, "Starting scheduled retry sweep");
  setInterval(() => {
    runStuckOrderRetrySweep().catch(err => {
      logger.error({ err }, "Unhandled error in scheduled retry sweep");
    });
  }, RETRY_INTERVAL_MS);
}
