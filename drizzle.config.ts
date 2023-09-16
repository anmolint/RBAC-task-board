import type { Config } from "drizzle-kit";
import { envVars } from "./src/config";

export default {
  schema: "./src/database/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: envVars.databaseUrl,
  },
} satisfies Config;
