import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { envVars } from "../config";

const sql = postgres(envVars.databaseUrl, { max: 1 });
const db = drizzle(sql);
async function main() {
  console.info("migrations started  ---------");
  await migrate(db, { migrationsFolder: "./drizzle" });
}

main()
  .then(() => {
    console.info("migrations finished ---------");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(0);
  });
