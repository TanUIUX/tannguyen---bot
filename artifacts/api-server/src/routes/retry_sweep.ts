import { Router, type IRouter } from "express";
import { requireAuth } from "../middlewares/auth";
import { runStuckOrderRetrySweep, getLastSweepAt } from "../lib/scheduledRetry";
import { logger } from "../lib/logger";

const router: IRouter = Router();

router.get("/admin/retry-sweep/status", requireAuth, async (_req, res): Promise<void> => {
  const ts = getLastSweepAt();
  res.json({ lastSweepAt: ts ? ts.toISOString() : null });
});

router.post("/admin/retry-sweep", requireAuth, async (_req, res): Promise<void> => {
  try {
    const result = await runStuckOrderRetrySweep();
    if (result.alreadyRunning) {
      res.status(409).json(result);
      return;
    }
    res.json(result);
  } catch (err) {
    logger.error({ err }, "Error in POST /admin/retry-sweep");
    res.status(500).json({ error: "Retry sweep encountered an error" });
  }
});

export default router;
