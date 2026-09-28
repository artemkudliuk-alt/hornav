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
import net from "net";

const { Pool, types } = pg;

// Читаем даты и JSON сырым текстом и так же пишем обратно — Postgres сам приведёт тип.
// Иначе pg разберёт timestamp в Date по часовому поясу процесса и может сдвинуть время,
// а JSON-массив превратит в JS-массив, который при вставке станет массивом Postgres, а не jsonb.
for (const oid of [1082 /* date */, 1114 /* timestamp */, 1184 /* timestamptz */, 114 /* json */, 3802 /* jsonb */]) {
  types.setTypeParser(oid, (v) => v);
}

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

// sslmode из строки Neon pg трактует по-своему и шумит предупреждением —
// TLS задаём явно, а параметр из адреса убираем.
const stripSsl = (url) => { const u = new URL(url); u.searchParams.delete("sslmode"); u.searchParams.delete("channel_binding"); return u.toString(); };

const mkPgPool = (url) =>
  new Pool({
    connectionString: isLocal(url) ? url : stripSsl(url),
    ssl: isLocal(url) ? undefined : { rejectUnauthorized: false },
    max: 3,
  });

function tcpReachable(host, port, ms = 6000) {
  return new Promise((done) => {
    const s = net.connect({ host, port });
    const t = setTimeout(() => { s.destroy(); done(false); }, ms);
    s.once("connect", () => { clearTimeout(t); s.end(); done(true); });
    s.once("error", () => { clearTimeout(t); done(false); });
  });
}

/**
 * Шаред-хостинги часто закрывают исходящий 5432. Тогда к Neon идём
 * через его WebSocket-драйвер по 443 — тот же порт, что у HTTPS.
 */
async function mkTargetPool(url) {
  if (isLocal(url)) return { pool: mkPgPool(url), via: "pg, локально" };
  const host = new URL(url).hostname;
  if (await tcpReachable(host, 5432)) return { pool: mkPgPool(url), via: "pg, порт 5432" };
  const { Pool: NeonPool } = await import("@neondatabase/serverless");
  return { pool: new NeonPool({ connectionString: url }), via: "Neon WebSocket, порт 443 (5432 закрыт хостингом)" };
}

/** AggregateError от Node приходит с пустым message — раскрываем вложенные. */
export function describe(err) {
  const parts = [err?.message || err?.name || "ошибка без текста"];
  if (err?.code) parts.push(`код ${err.code}`);
  for (const e of err?.errors || []) parts.push(`${e.code || ""} ${e.address || ""}:${e.port || ""}`.trim());
  return parts.join(" | ");
}

const src = mkPgPool(need("SOURCE_URL"));
const { pool: dst, via: dstVia } = await mkTargetPool(need("TARGET_URL"));
// Без слушателя драйверы роняют процесс событием 'error' от простаивающего соединения.
for (const [name, pool] of [["источник", src], ["приёмник", dst]]) {
  pool.on("error", (e) => console.error(`  [${name}: соединение закрылось] ${describe(e)}`));
}

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
  console.log(`  приёмник подключается через: ${dstVia}`);
  let total = 0;
  try {
    // Проверяем обе стороны по отдельности, чтобы ошибка сразу говорила, кто виноват.
    for (const [name, pool] of [["источник (база cPanel)", src], ["приёмник (Neon)", dst]]) {
      try {
        await pool.query("SELECT 1");
        console.log(`  ${name}: подключение есть`);
      } catch (e) {
        throw new Error(`${name}: ${describe(e)}`);
      }
    }
    console.log("");
    for (const t of TABLES) {
      const { copied } = await copyTable(t);
      total += copied;
    }
    console.log(`\nИтого строк: ${total}`);
  } catch (err) {
    console.error("\nОШИБКА:", describe(err));
    process.exitCode = 1;
  } finally {
    await src.end().catch(() => {});
    await dst.end().catch(() => {});
  }
})();
