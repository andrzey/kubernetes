import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { auth } from "./lib/auth.ts";

const app = new Hono();

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.get("/", async (c) => {
  return c.json({ message: "Hello, World!" });
});

app.get("/health", (c) => c.text("OK"));

const port = 3001;
console.log(`Server starter på port ${port}`);

serve({
  fetch: app.fetch,
  port,
  hostname: "0.0.0.0",
});
