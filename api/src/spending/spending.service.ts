import { SpendingRepository } from "./spending.repository.ts";
import { SPENDING_CATEGORIES } from "../db/schema/spending-schema.ts";

export type CreateSpendingInput = {
  amount: number;
  category: string;
  description?: string;
};

export class SpendingService {
  constructor(private readonly repository: SpendingRepository) {}

  getCategories() {
    return SPENDING_CATEGORIES;
  }

  async getSpendingsForUser(userId: string) {
    return this.repository.findAllByUser(userId);
  }

  async addSpending(userId: string, input: CreateSpendingInput) {
    if (!input.amount || !input.category) {
      throw new Error("amount and category are required");
    }

    return this.repository.create({
      userId,
      amount: Math.round(input.amount * 100),
      category: input.category,
      description: input.description ?? null,
    });
  }

  async deleteSpending(id: string, userId: string) {
    const row = await this.repository.deleteById(id);

    if (!row || row.userId !== userId) {
      throw new Error("Not found");
    }

    return row;
  }
}

export const spendingService = new SpendingService(new SpendingRepository());
