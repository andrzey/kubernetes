import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth-schema.ts";

export const SPENDING_CATEGORIES = [
  "Food & Dining",
  "Transport",
  "Housing",
  "Entertainment",
  "Health",
  "Shopping",
  "Travel",
  "Other",
] as const;

export const spending = pgTable("spending", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(), // stored in cents
  category: text("category").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
