import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { envVars } from "../config";

const queryClient = postgres(envVars.databaseUrl);
export const db: PostgresJsDatabase = drizzle(queryClient);
