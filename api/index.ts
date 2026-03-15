import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.json({
    message: "Hono API kjører i clusteret med en endring for Keel!",
  });
});

app.get("/health", (c) => c.text("OK"));

const port = 3000;
console.log(`Server starter på port ${port}`);

serve({
  fetch: app.fetch,
  port,
  hostname: "0.0.0.0",
});
