import { eq } from "drizzle-orm";
import { db } from "../db/index.ts";
import { spending } from "../db/schema/spending-schema.ts";

export type NewSpending = {
  userId: string;
  amount: number;
  category: string;
  description: string | null;
};

export class SpendingRepository {
  async findAllByUser(userId: string) {
    return db
      .select()
      .from(spending)
      .where(eq(spending.userId, userId))
      .orderBy(spending.createdAt);
  }

  async create(data: NewSpending) {
    const [row] = await db.insert(spending).values(data).returning();
    return row;
  }

  async deleteById(id: string) {
    const [row] = await db
      .delete(spending)
      .where(eq(spending.id, id))
      .returning();
    return row ?? null;
  }
}
