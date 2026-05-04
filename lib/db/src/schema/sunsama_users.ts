import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const sunsamaUsersTable = pgTable("sunsama_users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  password: text("password").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertSunsamaUserSchema = createInsertSchema(sunsamaUsersTable).omit({ createdAt: true, updatedAt: true });
export type InsertSunsamaUser = z.infer<typeof insertSunsamaUserSchema>;
export type SunsamaUser = typeof sunsamaUsersTable.$inferSelect;
