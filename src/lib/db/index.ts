import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { pool, isDbConnected } from "./pool";
import { ensureDatabaseInitialized } from "./init-db";

export { isDbConnected, pool };

export const db = drizzle(pool, { schema });

if (isDbConnected) {
  ensureDatabaseInitialized().catch((e) => console.error("DB init error:", e));
}
