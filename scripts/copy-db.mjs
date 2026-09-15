#!/usr/bin/env node
/**
 * Перенос данных из Neon в PostgreSQL хостинга.
 *
 * Через pg_dump это сделать нельзя: на сервере клиент версии 10, а Neon работает
 * на 15-17, и старый pg_dump отказывается читать более новый сервер. Поэтому
 * переливаем построчно обычными запросами — версии при таком способе не важны.
 *
 *   SOURCE_URL='postgres://...neon...' \
 *   TARGET_URL='postgres://user:pass@localhost:5432/base' \
 *   node scripts/copy-db.mjs
 *
 * Флаги:
 *   --truncate  очистить таблицы приёмника перед заливкой
 *   --dry       только посчитать строки, ничего не писать
 */
import pg from "pg";

const { Pool } = pg;

// Порядок важен: родительские таблицы идут раньше тех, что на них ссылаются.
const TABLES = [
  "users",
  "vessels",
  "vessel_media",
  "leads",
  "pages",
  "company_contacts",
  "branch_offices",
];

const BATCH = 200;

const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const TRUNCATE = args.includes("--truncate");

const need = (name) => {
  const v = process.env[name];
  if (!v) {
    console.error(`Не задана переменная ${name}`);
    process.exit(1);
  }
  return v;
};

const isLocal = (url) => /@(localhost|127\.0\.0\.1)[:/]/.test(url);
const mkPool = (url) =>
  new Pool({
    connectionString: url,
    ssl: isLocal(url) ? undefined : { rejectUnauthorized: false },
    max: 3,
  });

const src = mkPool(need("SOURCE_URL"));
const dst = mkPool(need("TARGET_URL"));

const quote = (id) => '"' + String(id).replace(/"/g, '""') + '"';

async function tableExists(pool, table) {
  const r = await pool.query("SELECT to_regclass($1) AS t", [`public.${table}`]);
  return r.rows[0].t !== null;
}

async function copyTable(table) {
  if (!(await tableExists(src, table))) {
    console.log(`  ${table.padEnd(18)} нет в источнике — пропускаю`);
    return { copied: 0, skipped: true };
  }
  if (!(await tableExists(dst, table))) {
    console.log(`  ${table.padEnd(18)} нет в приёмнике — сначала запустите приложение, оно создаст таблицы`);
    return { copied: 0, skipped: true };
  }

  const { rows } = await src.query(`SELECT * FROM ${quote(table)}`);
  if (rows.length === 0) {
    console.log(`  ${table.padEnd(18)} пусто`);
    return { copied: 0 };
  }

  if (DRY) {
    console.log(`  ${table.padEnd(18)} ${String(rows.length).padStart(5)} строк (пробный прогон)`);
    return { copied: 0 };
  }

  // Колонки берём по пересечению: если схемы чуть разошлись, лишнее не уронит вставку.
  const dstCols = new Set(
    (
      await dst.query(
        "SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name=$1",
        [table]
      )
    ).rows.map((r) => r.column_name)
  );
  const cols = Object.keys(rows[0]).filter((c) => dstCols.has(c));
  const missing = Object.keys(rows[0]).filter((c) => !dstCols.has(c));
  if (missing.length) {
    console.log(`  ${table.padEnd(18)} внимание: в приёмнике нет колонок ${missing.join(", ")}`);
  }

  if (TRUNCATE) await dst.query(`TRUNCATE ${quote(table)} CASCADE`);

  let copied = 0;
  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);
    const values = [];
    const tuples = chunk.map(
      (row) =>
        "(" +
        cols
          .map((c) => {
            values.push(row[c]);
            return `$${values.length}`;
          })
          .join(", ") +
        ")"
    );
    await dst.query(
      `INSERT INTO ${quote(table)} (${cols.map(quote).join(", ")})
       VALUES ${tuples.join(", ")}
       ON CONFLICT DO NOTHING`,
      values
    );
    copied += chunk.length;
  }

  const after = await dst.query(`SELECT count(*)::int AS n FROM ${quote(table)}`);
  console.log(`  ${table.padEnd(18)} ${String(copied).padStart(5)} перенесено, в приёмнике теперь ${after.rows[0].n}`);
  return { copied };
}

(async () => {
  console.log(DRY ? "ПРОБНЫЙ ПРОГОН — ничего не пишем\n" : "Перенос данных\n");
  let total = 0;
  try {
    for (const t of TABLES) {
      const { copied } = await copyTable(t);
      total += copied;
    }
    console.log(`\nИтого строк: ${total}`);
  } catch (err) {
    console.error("\nОШИБКА:", err.message);
    process.exitCode = 1;
  } finally {
    await src.end().catch(() => {});
    await dst.end().catch(() => {});
  }
})();
