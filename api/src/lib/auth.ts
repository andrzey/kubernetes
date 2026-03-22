import "dotenv/config";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index.ts";
import * as schema from "../db/schema/auth-schema.ts";
import { emailService } from "../email/email.service.ts";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  basePath: "/auth",
  trustedOrigins: ["http://localhost:5173", "http://frontend.local:8080"],
  debugLogs: true,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 4,
    autoSignInAfterSignUp: true,
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail(data, request) {
      const {
        user: { email },
        token,
      } = data;

      emailService.sendVerificationEmail({
        to: email,
        token,
      });

      return Promise.resolve();
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
});
