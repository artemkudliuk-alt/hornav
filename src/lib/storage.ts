import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { put, del } from "@vercel/blob";

/**
 * Хранилище загрузок в двух режимах — один код и для Vercel, и для cPanel.
 *
 * Задан BLOB_READ_WRITE_TOKEN → Vercel Blob. На Vercel иначе нельзя:
 * файловая система там не переживает деплой.
 *
 * Токена нет → диск. UPLOADS_DIR должен указывать на папку ЗА пределами сборки,
 * иначе очередной деплой затрёт всё, что загрузили через админку.
 * На cPanel: UPLOADS_DIR=/home/<акк>/data/uploads, а public/uploads — симлинк туда.
 */
const USE_BLOB = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

const UPLOADS_DIR = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.join(process.cwd(), "public", "uploads");

/** Публичный префикс, под которым папка отдаётся наружу в дисковом режиме. */
const PUBLIC_PREFIX = "/uploads";

const BLOB_HOST = /\.public\.blob\.vercel-storage\.com\//i;

function safeName(original: string): string {
  const cleaned = path
    .basename(original)
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(-120);
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${cleaned || "file"}`;
}

/** Не выпускаем запись и удаление за пределы UPLOADS_DIR. */
function resolveInside(key: string): string | null {
  const target = path.resolve(UPLOADS_DIR, key);
  const root = UPLOADS_DIR.endsWith(path.sep) ? UPLOADS_DIR : UPLOADS_DIR + path.sep;
  return target === UPLOADS_DIR || target.startsWith(root) ? target : null;
}

export async function saveUpload(
  data: Buffer,
  originalName: string,
  subdir = ""
): Promise<{ url: string; key: string }> {
  const cleanSubdir = subdir.replace(/[^a-zA-Z0-9/_-]/g, "").replace(/^\/+|\/+$/g, "");
  const key = cleanSubdir ? `${cleanSubdir}/${safeName(originalName)}` : safeName(originalName);

  if (USE_BLOB) {
    // Ключ уже уникален (время + случайный хвост), свой суффикс Blob не нужен.
    const blob = await put(key, data, { access: "public", addRandomSuffix: false });
    return { url: blob.url, key: blob.pathname };
  }

  const dest = resolveInside(key);
  if (!dest) throw new Error(`Недопустимый путь загрузки: ${key}`);

  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, data);

  return { url: `${PUBLIC_PREFIX}/${key}`, key };
}

/**
 * Принимает ссылку на Blob, путь вида /uploads/... или голый ключ.
 * Чужие абсолютные ссылки молча пропускает — их файлов у нас нет.
 * Удаление идемпотентно: отсутствие файла — не ошибка.
 */
export async function deleteUpload(urlOrKey: string): Promise<void> {
  if (!urlOrKey) return;

  if (/^https?:\/\//i.test(urlOrKey)) {
    if (USE_BLOB && BLOB_HOST.test(urlOrKey)) await del(urlOrKey).catch(() => {});
    return;
  }

  const key = urlOrKey.replace(/^\/+/, "").replace(/^uploads\//, "");
  if (!key) return;

  const target = resolveInside(key);
  if (!target) return;

  await unlink(target).catch(() => {});
}

export { UPLOADS_DIR, USE_BLOB };
