import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

/**
 * Загрузки на диске вместо Vercel Blob.
 *
 * UPLOADS_DIR задаётся снаружи и должен указывать на папку ЗА пределами сборки,
 * иначе очередной деплой затрёт всё, что загрузили через админку.
 * На хостинге: UPLOADS_DIR=/home/<акк>/data/uploads, а public/uploads — симлинк туда.
 */
const UPLOADS_DIR = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.join(process.cwd(), "public", "uploads");

/** Публичный префикс, под которым папка отдаётся наружу. */
const PUBLIC_PREFIX = "/uploads";

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

  const dest = resolveInside(key);
  if (!dest) throw new Error(`Недопустимый путь загрузки: ${key}`);

  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, data);

  return { url: `${PUBLIC_PREFIX}/${key}`, key };
}

/**
 * Принимает и ключ, и путь вида /uploads/..., и старый абсолютный URL на Vercel Blob.
 * Чужие абсолютные ссылки молча пропускает — их файлов у нас нет.
 */
export async function deleteUpload(urlOrKey: string): Promise<void> {
  if (!urlOrKey) return;
  if (/^https?:\/\//i.test(urlOrKey)) return;

  const key = urlOrKey.replace(/^\/+/, "").replace(/^uploads\//, "");
  if (!key) return;

  const target = resolveInside(key);
  if (!target) return;

  // Файла может уже не быть — это не ошибка, удаление идемпотентно.
  await unlink(target).catch(() => {});
}

export { UPLOADS_DIR };
