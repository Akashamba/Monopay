import { type Config } from "drizzle-kit";

import { readEnv } from "@/env";

export default {
  schema: [
    "./server/db/auth-schema.ts",
    "./server/db/game-schema.ts",
    "./server/db/relations.ts",
  ],
  dialect: "postgresql",
  dbCredentials: {
    url: readEnv("DATABASE_URL") ?? "",
  },
  tablesFilter: ["monopoly_banking_app_*"],
} satisfies Config;
