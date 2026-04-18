import { pgTable, serial, text, timestamp, integer, boolean, jsonb, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const promotionsTable = pgTable("promotions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  code: text("code").unique(),
  type: text("type").notNull(),
  discountValue: numeric("discount_value", { precision: 12, scale: 2 }),
  appliesTo: text("applies_to").notNull().default("all"),
  categoryId: integer("category_id"),
  productId: integer("product_id"),
  customerTarget: text("customer_target").notNull().default("all"),
  customerId: integer("customer_id"),
  tiers: jsonb("tiers"),
  startDate: timestamp("start_date", { withTimezone: true }),
  endDate: timestamp("end_date", { withTimezone: true }),
  usageLimit: integer("usage_limit"),
  useCount: integer("use_count").notNull().default(0),
  priority: integer("priority").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertPromotionSchema = createInsertSchema(promotionsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertPromotion = z.infer<typeof insertPromotionSchema>;
export type Promotion = typeof promotionsTable.$inferSelect;
