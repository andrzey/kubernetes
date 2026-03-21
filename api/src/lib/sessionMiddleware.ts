import { auth } from "./auth.ts";
import { UnauthorizedError } from "./errors.ts";
import type { MiddlewareHandler } from "hono";

export const sessionMiddleware: MiddlewareHandler = async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session?.user) {
    throw new UnauthorizedError();
  }

  if (!session.user.emailVerified) {
    throw new UnauthorizedError("Unverified email");
  }

  c.set("userId", session.user.id);
  await next();
};
