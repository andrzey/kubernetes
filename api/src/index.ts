import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { getUsers } from "./service.ts";

const app = new Hono();

app.get("/", async (c) => {
  const users = await getUsers();

  return c.json({
    message: JSON.stringify(users),
  });
});

app.get("/health", (c) => c.text("OK"));

const port = 3001;
console.log(`Server starter på port ${port}`);

serve({
  fetch: app.fetch,
  port,
  hostname: "0.0.0.0",
});
