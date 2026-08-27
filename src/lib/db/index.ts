import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const dbUrl = process.env.DATABASE_URL || "";

export const isDbConnected = Boolean(
  dbUrl &&
  !dbUrl.includes("user:password") &&
  !dbUrl.includes("localhost/danamira") &&
  dbUrl.startsWith("postgresql://")
);

const sql = isDbConnected ? neon(dbUrl) : neon("postgresql://mock:mock@mock.neon.tech/mock?sslmode=require");
export const db = drizzle(sql, { schema });
