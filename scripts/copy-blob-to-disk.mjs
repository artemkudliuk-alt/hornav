#!/usr/bin/env node
/**
 * Перенос медиафайлов из Vercel Blob на диск хостинга (~/data/uploads)
 * с обновлением ссылок в базе данных PostgreSQL.
 *
 * Скрипт находит все внешние URL (Vercel Blob и http/https) в:
 *   1. vessel_media (url, blob_key)
 *   2. vessels (cover_image_url)
 *   3. pages (og_image, content)
 *
 * Скачивает файлы на диск и заменяет в базе ссылки на относительные /uploads/...
 *
 * Использование:
 *   TARGET_URL='postgres://user:pass@localhost:5432/base' \
 *   UPLOADS_DIR='/home/maxic191/data/uploads' \
 *   node scripts/copy-blob-to-disk.mjs
 *
 * Флаги:
 *   --dry     только проверить и показать, что будет скачано и обновлено
 *   --force   перекачивать файлы, даже если они уже есть на диске
 */

import pg from "pg";
import { writeFile, mkdir, stat } from "fs/promises";
import path from "path";

const { Pool } = pg;

const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const FORCE = args.includes("--force");

const targetUrl =
  process.env.TARGET_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL;

if (!targetUrl) {
  console.error("❌ Ошибка: не задана переменная TARGET_URL или DATABASE_URL.");
  console.error("Пример запуска:");
  console.error("  TARGET_URL='postgres://user:pass@localhost:5432/base' UPLOADS_DIR='/home/maxic191/data/uploads' node scripts/copy-blob-to-disk.mjs");
  process.exit(1);
}

const uploadsDir = path.resolve(
  process.env.UPLOADS_DIR || path.join(process.cwd(), "public", "uploads")
);

const isLocal = (url) => /@(localhost|127\.0\.0\.1)[:/]/.test(url);
const pool = new Pool({
  connectionString: targetUrl,
  ssl: isLocal(targetUrl) ? undefined : { rejectUnauthorized: false },
  max: 3,
});

function sanitizeFilename(name) {
  const base = path.basename(name).replace(/[^a-zA-Z0-9._-]/g, "_");
  return base || "file";
}

function extractFilenameFromUrl(urlStr, fallback = "media") {
  try {
    const parsed = new URL(urlStr);
    const pathname = decodeURIComponent(parsed.pathname);
    const base = path.basename(pathname);
    return sanitizeFilename(base) || fallback;
  } catch {
    return fallback;
  }
}

async function fileExists(filePath) {
  try {
    const s = await stat(filePath);
    return s.isFile() && s.size > 0;
  } catch {
    return false;
  }
}

async function downloadFile(url, destPath) {
  if (!FORCE && (await fileExists(destPath))) {
    return { skipped: true };
  }

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Danamira-Migration/1.0",
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await mkdir(path.dirname(destPath), { recursive: true });
  await writeFile(destPath, buffer);

  return { skipped: false, bytes: buffer.length };
}

async function tableExists(table) {
  const r = await pool.query("SELECT to_regclass($1) AS t", [`public.${table}`]);
  return r.rows[0].t !== null;
}

// Кэш соответствия: remoteUrl -> localUrl (чтобы один и тот же файл не качать дважды)
const urlMap = new Map();

async function migrateVesselMedia() {
  if (!(await tableExists("vessel_media"))) {
    console.log("ℹ️  Таблица vessel_media отсутствует, пропускаю.");
    return { count: 0, downloaded: 0, failed: 0 };
  }

  const { rows } = await pool.query(
    "SELECT id, vessel_id, url, filename, type FROM vessel_media WHERE url LIKE 'http://%' OR url LIKE 'https://%' ORDER BY sort_order ASC"
  );

  console.log(`\n📦 Таблица vessel_media: найдено ${rows.length} записей с внешними ссылками`);

  let count = 0;
  let downloaded = 0;
  let failed = 0;

  for (const row of rows) {
    const remoteUrl = row.url;
    const vesselId = row.vessel_id || "general";
    const rawName = row.filename || extractFilenameFromUrl(remoteUrl, `media-${row.id}`);
    const safeName = sanitizeFilename(rawName);

    const relKey = `vessels/${vesselId}/${safeName}`;
    const destPath = path.join(uploadsDir, relKey);
    const localUrl = `/uploads/${relKey}`;

    if (DRY) {
      console.log(`  [DRY] ${remoteUrl} -> ${localUrl}`);
      urlMap.set(remoteUrl, localUrl);
      count++;
      continue;
    }

    try {
      const result = await downloadFile(remoteUrl, destPath);
      if (result.skipped) {
        console.log(`  ⏩ Уже на диске: ${relKey}`);
      } else {
        console.log(`  ⬇️  Скачано (${(result.bytes / 1024).toFixed(1)} KB): ${relKey}`);
        downloaded++;
      }

      await pool.query(
        "UPDATE vessel_media SET url = $1, blob_key = $2 WHERE id = $3",
        [localUrl, relKey, row.id]
      );

      urlMap.set(remoteUrl, localUrl);
      count++;
    } catch (err) {
      console.error(`  ❌ Ошибка загрузки [${row.id}] ${remoteUrl}:`, err.message);
      failed++;
    }
  }

  return { count, downloaded, failed };
}

async function migrateVesselsCover() {
  if (!(await tableExists("vessels"))) {
    return { count: 0, downloaded: 0, failed: 0 };
  }

  const { rows } = await pool.query(
    "SELECT id, cover_image_url FROM vessels WHERE cover_image_url LIKE 'http://%' OR cover_image_url LIKE 'https://%'"
  );

  console.log(`\n🚢 Таблица vessels: найдено ${rows.length} судов с внешними cover_image_url`);

  let count = 0;
  let downloaded = 0;
  let failed = 0;

  for (const row of rows) {
    const remoteUrl = row.cover_image_url;

    // Если этот URL уже был скачан для vessel_media:
    if (urlMap.has(remoteUrl)) {
      const localUrl = urlMap.get(remoteUrl);
      if (!DRY) {
        await pool.query("UPDATE vessels SET cover_image_url = $1 WHERE id = $2", [
          localUrl,
          row.id,
        ]);
      }
      console.log(`  🔗 Использована уже скачанная копия: ${localUrl}`);
      count++;
      continue;
    }

    const rawName = extractFilenameFromUrl(remoteUrl, `cover-${row.id}.jpg`);
    const safeName = sanitizeFilename(rawName);
    const relKey = `vessels/${row.id}/${safeName}`;
    const destPath = path.join(uploadsDir, relKey);
    const localUrl = `/uploads/${relKey}`;

    if (DRY) {
      console.log(`  [DRY] Cover: ${remoteUrl} -> ${localUrl}`);
      count++;
      continue;
    }

    try {
      const result = await downloadFile(remoteUrl, destPath);
      if (result.skipped) {
        console.log(`  ⏩ Уже на диске: ${relKey}`);
      } else {
        console.log(`  ⬇️  Скачано (${(result.bytes / 1024).toFixed(1)} KB): ${relKey}`);
        downloaded++;
      }

      await pool.query("UPDATE vessels SET cover_image_url = $1 WHERE id = $2", [
        localUrl,
        row.id,
      ]);
      urlMap.set(remoteUrl, localUrl);
      count++;
    } catch (err) {
      console.error(`  ❌ Ошибка загрузки обложки [${row.id}]:`, err.message);
      failed++;
    }
  }

  return { count, downloaded, failed };
}

async function migratePagesMedia() {
  if (!(await tableExists("pages"))) {
    return { count: 0 };
  }

  const { rows } = await pool.query("SELECT id, slug, og_image, content FROM pages");
  let updatedCount = 0;

  for (const row of rows) {
    let changed = false;
    let ogImage = row.og_image;
    let contentStr = JSON.stringify(row.content);

    // Проверяем og_image
    if (ogImage && typeof ogImage === "object") {
      for (const lang of ["en", "ua", "ru"]) {
        const val = ogImage[lang];
        if (typeof val === "string" && (val.startsWith("http://") || val.startsWith("https://"))) {
          const rawName = extractFilenameFromUrl(val, `og-${row.slug}-${lang}.jpg`);
          const relKey = `pages/${row.slug}/${rawName}`;
          const destPath = path.join(uploadsDir, relKey);
          const localUrl = `/uploads/${relKey}`;

          if (DRY) {
            console.log(`  [DRY] Page OG [${row.slug}.${lang}]: ${val} -> ${localUrl}`);
            ogImage[lang] = localUrl;
            changed = true;
          } else {
            try {
              await downloadFile(val, destPath);
              ogImage[lang] = localUrl;
              changed = true;
            } catch (e) {
              console.error(`  ❌ Ошибка загрузки OG для страницы ${row.slug}:`, e.message);
            }
          }
        }
      }
    }

    // Ищем ссылки на Vercel Blob в содержимом страниц
    const blobRegex = /https:\/\/[a-zA-Z0-9._-]+\.public\.blob\.vercel-storage\.com\/[^\s"'\\]+/g;
    const matches = contentStr ? contentStr.match(blobRegex) : null;
    if (matches && matches.length > 0) {
      for (const matchUrl of matches) {
        if (urlMap.has(matchUrl)) {
          contentStr = contentStr.replaceAll(matchUrl, urlMap.get(matchUrl));
          changed = true;
        } else {
          const rawName = extractFilenameFromUrl(matchUrl, `page-media-${row.slug}.jpg`);
          const relKey = `pages/${row.slug}/${rawName}`;
          const destPath = path.join(uploadsDir, relKey);
          const localUrl = `/uploads/${relKey}`;

          if (DRY) {
            console.log(`  [DRY] Page content media: ${matchUrl} -> ${localUrl}`);
            contentStr = contentStr.replaceAll(matchUrl, localUrl);
            changed = true;
          } else {
            try {
              await downloadFile(matchUrl, destPath);
              urlMap.set(matchUrl, localUrl);
              contentStr = contentStr.replaceAll(matchUrl, localUrl);
              changed = true;
            } catch (e) {
              console.error(`  ❌ Ошибка загрузки контента страницы ${row.slug}:`, e.message);
            }
          }
        }
      }
    }

    if (changed && !DRY) {
      await pool.query(
        "UPDATE pages SET og_image = $1, content = $2 WHERE id = $3",
        [JSON.stringify(ogImage), contentStr, row.id]
      );
      updatedCount++;
    }
  }

  if (updatedCount > 0) {
    console.log(`\n📄 Страницы: обновлено записей: ${updatedCount}`);
  }

  return { count: updatedCount };
}

(async () => {
  console.log(DRY ? "=== ПРОБНЫЙ ПРОГОН (DRY RUN) ===" : "=== МИГРАЦИЯ МЕДИАФАЙЛОВ ===");
  console.log(`Папка для сохранения: ${uploadsDir}`);
  console.log(`База данных:          ${targetUrl.replace(/:[^:@]+@/, ":***@")}\n`);

  try {
    if (!DRY) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const mediaRes = await migrateVesselMedia();
    const coverRes = await migrateVesselsCover();
    await migratePagesMedia();

    console.log("\n================ИТОГ================");
    console.log(`Всего ссылок обработано: ${mediaRes.count + coverRes.count}`);
    console.log(`Новых файлов скачано:    ${mediaRes.downloaded + coverRes.downloaded}`);
    if (mediaRes.failed + coverRes.failed > 0) {
      console.log(`⚠️  Ошибок скачивания:     ${mediaRes.failed + coverRes.failed}`);
    }
    console.log("Готово! Все ссылки в БД переведены на локальный префикс /uploads/.");
  } catch (err) {
    console.error("\n❌ КРИТИЧЕСКАЯ ОШИБКА:", err.message);
    process.exitCode = 1;
  } finally {
    await pool.end().catch(() => {});
  }
})();
