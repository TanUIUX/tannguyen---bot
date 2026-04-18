import { pgTable, serial, text, jsonb, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const botPendingActionsTable = pgTable(
  "bot_pending_actions",
  {
    id: serial("id").primaryKey(),
    chatId: text("chat_id").notNull(),
    action: text("action").notNull(),
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    chatActionUnique: uniqueIndex("bot_pending_actions_chat_action_uniq").on(table.chatId, table.action),
  }),
);

export type BotPendingAction = typeof botPendingActionsTable.$inferSelect;
