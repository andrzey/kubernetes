import { Hono } from "hono";
import { spendingService } from "../spending/spending.service.ts";

type Variables = { userId: string };

const app = new Hono<{ Variables: Variables }>();

app.get("/categories", (c) => {
  return c.json(spendingService.getCategories());
});

app.get("/", async (c) => {
  const spendings = await spendingService.getSpendingsForUser(c.get("userId"));
  return c.json(spendings);
});

app.post("/", async (c) => {
  const body = await c.req.json<{
    amount: number;
    category: string;
    description?: string;
  }>();
  const row = await spendingService.addSpending(c.get("userId"), body);
  return c.json(row, 201);
});

app.delete("/:id", async (c) => {
  await spendingService.deleteSpending(c.req.param("id"), c.get("userId"));
  return c.json({ success: true });
});

export default app;
