import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { auth } from "./lib/auth.ts";
import spendingRoutes from "./routes/spending.ts";
import { sessionMiddleware } from "./lib/sessionMiddleware.ts";
import { AppError } from "./lib/errors.ts";

const app = new Hono();

app.use("*", logger());

app.onError((err, c) => {
  if (err instanceof AppError) {
    return c.json({ error: err.message }, err.statusCode);
  }
  console.error(err);
  return c.json({ error: "Internal server error" }, 500);
});

const corsMiddleware = cors({
  origin: ["http://localhost:5173"],
  allowMethods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type"],
  credentials: true,
});

app.use("/auth/*", corsMiddleware);
app.use("/spending/*", corsMiddleware);
app.use("/spending/*", sessionMiddleware);

app.on(["POST", "GET"], "/auth/*", async (c) => {
  const res = await auth.handler(c.req.raw);

  const url = new URL(c.req.url);
  if (url.pathname.includes("/verify-email") && res.ok) {
    return c.redirect("http://localhost:5173"); // TODO: This should come from env.
  }

  return res;
});

app.route("/spending", spendingRoutes);

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
