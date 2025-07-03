import { type Config } from "drizzle-kit";

import { readEnv } from "@/env";

export default {
  schema: [
    // "./src/server/db/schema.ts",
    "./server/db/auth-schema.ts",
  ],
  dialect: "postgresql",
  dbCredentials: {
    url: readEnv("DATABASE_URL") ?? "",
  },
  tablesFilter: ["flipside_*"],
} satisfies Config;
