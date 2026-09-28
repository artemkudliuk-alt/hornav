#!/usr/bin/env node
/**
 * Перенос загруженных файлов с диска cPanel в Vercel Blob
 * с заменой ссылок /uploads/... на адреса Blob в базе.
 *
 * Запускается на сервере cPanel: файлы лежат там на диске, а новая база
 * и Blob доступны по сети. Запускать ПОСЛЕ copy-db.mjs — ссылки правятся
 * уже в новой базе.
 *
 *   TARGET_URL='postgres://...neon...' \
 *   UPLOADS_DIR='/home/maxic191/data/uploads' \
 *   BLOB_READ_WRITE_TOKEN='vercel_blob_rw_...' \
 *   node copy-disk-to-blob.mjs
 *
 * Флаги:
 *   --dry  показать, что будет перенесено, ничего не записывая
 *
 * Пути /fleet/... не трогаются: это файлы из репозитория, они приезжают
 * вместе с деплоем. Повторный запуск безопасен — уже перенесённые
 * записи ссылаются на Blob и под выборку /uploads/ не попадают.
 */
import pg from "pg";
import { put } from "@vercel/blob";
import { readFile, stat } from "fs/promises";
import path from "path";
import net from "net";

const { Pool } = pg;
const DRY = process.argv.includes("--dry");

const need = (name) => {
  const v = process.env[name];
  if (!v) {
    console.error(`Не задана переменная ${name}`);
    process.exit(1);
  }
  return v;
};

const TARGET_URL = need("TARGET_URL");
const UPLOADS_DIR = path.resolve(need("UPLOADS_DIR"));
if (!DRY) need("BLOB_READ_WRITE_TOKEN");

const isLocal = (u) => /@(localhost|127\.0\.0\.1)[:/]/.test(u);
const stripSsl = (url) => { const u = new URL(url); u.searchParams.delete("sslmode"); u.searchParams.delete("channel_binding"); return u.toString(); };

function tcpReachable(host, port, ms = 6000) {
  return new Promise((done) => {
    const s = net.connect({ host, port });
    const t = setTimeout(() => { s.destroy(); done(false); }, ms);
    s.once("connect", () => { clearTimeout(t); s.end(); done(true); });
    s.once("error", () => { clearTimeout(t); done(false); });
  });
}

// Хостинг может закрывать исходящий 5432 — тогда к Neon через WebSocket по 443.
async function mkPool(url) {
  if (isLocal(url)) return { pool: new Pool({ connectionString: url, max: 3 }), via: "pg, локально" };
  if (await tcpReachable(new URL(url).hostname, 5432)) {
    return {
      pool: new Pool({ connectionString: stripSsl(url), ssl: { rejectUnauthorized: false }, max: 3 }),
      via: "pg, порт 5432",
    };
  }
  const { Pool: NeonPool } = await import("@neondatabase/serverless");
  return { pool: new NeonPool({ connectionString: url }), via: "Neon WebSocket, порт 443" };
}

function describe(err) {
  const parts = [err?.message || err?.name || "ошибка без текста"];
  if (err?.code) parts.push(`код ${err.code}`);
  for (const e of err?.errors || []) parts.push(`${e.code || ""} ${e.address || ""}:${e.port || ""}`.trim());
  return parts.join(" | ");
}

const { pool, via } = await mkPool(TARGET_URL);
// Без слушателя драйвер роняет процесс событием 'error' от простаивающего соединения.
pool.on("error", (e) => console.error(`  [соединение закрылось] ${describe(e)}`));

const MIME = {
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp",
  ".gif": "image/gif", ".svg": "image/svg+xml", ".pdf": "application/pdf",
  ".mp4": "video/mp4", ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

// /uploads/vessels/x/y.jpg -> vessels/x/y.jpg, с защитой от выхода за UPLOADS_DIR
function keyFromUrl(url) {
  const key = url.replace(/^\/+/, "").replace(/^uploads\//, "").split("?")[0];
  const abs = path.resolve(UPLOADS_DIR, key);
  return abs.startsWith(UPLOADS_DIR + path.sep) ? { key, abs } : null;
}

const moved = new Map(); // /uploads/... -> https://...blob...
const stats = { uploaded: 0, reused: 0, missing: [], failed: [] };

async function upload(localUrl) {
  if (moved.has(localUrl)) {
    stats.reused++;
    return moved.get(localUrl);
  }
  const k = keyFromUrl(localUrl);
  if (!k) {
    stats.failed.push(`${localUrl} — путь вне UPLOADS_DIR`);
    return null;
  }
  try {
    await stat(k.abs);
  } catch {
    stats.missing.push(localUrl);
    return null;
  }

  if (DRY) {
    console.log(`  [dry] ${localUrl}`);
    moved.set(localUrl, `(blob)/${k.key}`);
    stats.uploaded++;
    return moved.get(localUrl);
  }

  try {
    const blob = await put(k.key, await readFile(k.abs), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true, // повторный запуск не должен падать на уже залитом файле
      contentType: MIME[path.extname(k.key).toLowerCase()],
    });
    moved.set(localUrl, blob.url);
    stats.uploaded++;
    console.log(`  ↑ ${k.key}`);
    return blob.url;
  } catch (e) {
    stats.failed.push(`${localUrl} — ${e.message}`);
    return null;
  }
}

async function exists(table) {
  const r = await pool.query("SELECT to_regclass($1) AS t", [`public.${table}`]);
  return r.rows[0].t !== null;
}

async function migrateMedia() {
  if (!(await exists("vessel_media"))) return;
  const { rows } = await pool.query(
    "SELECT id, url FROM vessel_media WHERE url LIKE '/uploads/%' ORDER BY sort_order"
  );
  console.log(`\nvessel_media: ${rows.length} файлов на диске`);
  for (const r of rows) {
    const url = await upload(r.url);
    if (url && !DRY) {
      const key = new URL(url).pathname.replace(/^\//, "");
      await pool.query("UPDATE vessel_media SET url = $1, blob_key = $2 WHERE id = $3", [url, key, r.id]);
    }
  }
}

async function migrateCovers() {
  if (!(await exists("vessels"))) return;
  const { rows } = await pool.query(
    "SELECT id, cover_image_url FROM vessels WHERE cover_image_url LIKE '/uploads/%'"
  );
  console.log(`\nvessels: ${rows.length} обложек на диске`);
  for (const r of rows) {
    const url = await upload(r.cover_image_url);
    if (url && !DRY) {
      await pool.query("UPDATE vessels SET cover_image_url = $1 WHERE id = $2", [url, r.id]);
    }
  }
}

async function migratePages() {
  if (!(await exists("pages"))) return;
  const { rows } = await pool.query("SELECT id, slug, og_image, content FROM pages");
  const re = /\/uploads\/[^\s"'\\)]+/g;
  let changed = 0;
  for (const r of rows) {
    const og = r.og_image ? JSON.stringify(r.og_image) : null;
    const body = r.content ? JSON.stringify(r.content) : null;
    const found = new Set([...(og?.match(re) || []), ...(body?.match(re) || [])]);
    if (!found.size) continue;

    let newOg = og, newBody = body;
    for (const local of found) {
      const url = await upload(local);
      if (!url) continue;
      newOg = newOg?.split(local).join(url) ?? null;
      newBody = newBody?.split(local).join(url) ?? null;
    }
    if (!DRY && (newOg !== og || newBody !== body)) {
      await pool.query("UPDATE pages SET og_image = $1, content = $2 WHERE id = $3", [newOg, newBody, r.id]);
      changed++;
    }
  }
  console.log(`\npages: обновлено страниц — ${changed}`);
}

(async () => {
  console.log(DRY ? "ПРОБНЫЙ ПРОГОН — ничего не пишем" : "Перенос файлов в Vercel Blob");
  console.log(`папка: ${UPLOADS_DIR}`);
  console.log(`база подключается через: ${via}`);
  try {
    await migrateMedia();
    await migrateCovers();
    await migratePages();

    console.log("\n=========== ИТОГ ===========");
    console.log(`залито в Blob:          ${stats.uploaded}`);
    console.log(`повторных ссылок:       ${stats.reused}`);
    console.log(`нет на диске:           ${stats.missing.length}`);
    stats.missing.forEach((m) => console.log(`   - ${m}`));
    console.log(`ошибок:                 ${stats.failed.length}`);
    stats.failed.forEach((m) => console.log(`   - ${m}`));
    if (stats.failed.length) process.exitCode = 1;
  } catch (e) {
    console.error("\nОШИБКА:", describe(e));
    process.exitCode = 1;
  } finally {
    await pool.end().catch(() => {});
  }
})();
