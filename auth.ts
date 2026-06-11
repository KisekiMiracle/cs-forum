import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./app/db/drizzle";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import * as authSchema from "./app/db/schema"; // Path to your schema file

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema: {
      ...authSchema,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
});
