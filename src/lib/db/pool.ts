import { Pool } from "pg";

const dbUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.STORAGE_DATABASE_URL ||
  process.env.STORAGE_URL ||
  process.env.NEON_DATABASE_URL ||
  "";

export const isDbConnected = Boolean(
  dbUrl &&
  !dbUrl.includes("user:password") &&
  !dbUrl.includes("localhost/danamira") &&
  (dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://"))
);

/** Локальный сервер идёт без TLS, любой внешний — с ним. */
function needsSsl(url: string): boolean {
  if (/sslmode=disable/.test(url)) return false;
  return !/@(localhost|127\.0\.0\.1|\[::1\])[:/]/.test(url);
}

export const pool = new Pool({
  connectionString: isDbConnected ? dbUrl : undefined,
  ssl: isDbConnected && needsSsl(dbUrl) ? { rejectUnauthorized: false } : undefined,
  // ponytail: 5 соединений под лимит shared-хостинга в 20 процессов;
  // поднимать, если упрёмся в ожидание коннекта под нагрузкой
  max: 5,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

// Обрыв простаивающего соединения не должен ронять процесс.
pool.on("error", (err) => console.error("[db] ошибка простаивающего соединения:", err.message));

/**
 * Тегированный шаблон поверх pg — чтобы sql`...` в init-db работал без переписывания
 * четырёх десятков запросов. Значения уходят параметрами, не склейкой строк.
 */
export function sqlTag(strings: TemplateStringsArray, ...values: unknown[]) {
  const text = strings.reduce(
    (acc, part, i) => acc + part + (i < values.length ? `$${i + 1}` : ""),
    ""
  );
  return pool.query(text, values as never[]).then((r) => r.rows);
}
