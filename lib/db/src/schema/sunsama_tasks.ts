import { pgTable, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { sunsamaUsersTable } from "./sunsama_users";

export const sunsamaTasksTable = pgTable("sunsama_tasks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  completed: boolean("completed").notNull().default(false),
  dueDate: timestamp("due_date", { withTimezone: true }),
  plannedDate: timestamp("planned_date", { withTimezone: true }),
  startTime: text("start_time"),
  timeEstimate: integer("time_estimate"),
  actualTime: integer("actual_time"),
  isRecurring: boolean("is_recurring").notNull().default(false),
  recurrencePattern: text("recurrence_pattern"),
  recurrenceDays: text("recurrence_days"),
  recurrenceInterval: integer("recurrence_interval"),
  parentTaskId: text("parent_task_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  userId: text("user_id").notNull().references(() => sunsamaUsersTable.id, { onDelete: "cascade" }),
});

export const insertSunsamaTaskSchema = createInsertSchema(sunsamaTasksTable).omit({ createdAt: true, updatedAt: true });
export type InsertSunsamaTask = z.infer<typeof insertSunsamaTaskSchema>;
export type SunsamaTask = typeof sunsamaTasksTable.$inferSelect;
