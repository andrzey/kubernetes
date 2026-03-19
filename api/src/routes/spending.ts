import { Hono } from "hono";
import { auth } from "../lib/auth.ts";
import { spendingService } from "../spending/spending.service.ts";

type Variables = { userId: string };

const app = new Hono<{ Variables: Variables }>();

app.use("/*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session?.user) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  c.set("userId", session.user.id);
  await next();
});

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

  try {
    const row = await spendingService.addSpending(c.get("userId"), body);
    return c.json(row, 201);
  } catch (e) {
    return c.json({ error: (e as Error).message }, 400);
  }
});

app.delete("/:id", async (c) => {
  try {
    await spendingService.deleteSpending(c.req.param("id"), c.get("userId"));
    return c.json({ success: true });
  } catch {
    return c.json({ error: "Not found" }, 404);
  }
});

export default app;
