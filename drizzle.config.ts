import { type Config } from "drizzle-kit";

import { readEnv } from "@/env";

export default {
  schema: [
    "./server/db/schema.ts",
    "./server/db/auth-schema.ts",
  ],
  dialect: "postgresql",
  dbCredentials: {
    url: readEnv("DATABASE_URL") ?? "",
  },
  tablesFilter: ["monopoly_banking_app_*"],
} satisfies Config;
