import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { MEDIA_NAME } from "../media-url";
import { logger } from "./logger";

const log = logger("media");

/** Папка с загруженными фото. В Docker — отдельный том, чтобы фото переживали пересборку. */
export const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(process.cwd(), "uploads");

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ALLOWED_INPUT = new Set(["jpeg", "png", "webp", "heif", "avif", "gif", "tiff"]);

export class UploadError extends Error {}

/**
 * Принимает фото из формы, проверяет, что это действительно изображение,
 * поворачивает по EXIF, уменьшает до 1200 px, убирает метаданные (геометку и т. п.)
 * и сохраняет как WebP. Возвращает имя файла.
 */
export async function saveImage(file: File): Promise<string> {
  if (file.size > MAX_UPLOAD_BYTES) throw new UploadError("Фото больше 10 МБ — уменьшите его");
  const input = Buffer.from(await file.arrayBuffer());

  let meta: sharp.Metadata;
  try {
    meta = await sharp(input, { limitInputPixels: 60_000_000 }).metadata();
  } catch {
    throw new UploadError("Это не изображение или файл повреждён");
  }
  if (!meta.format || !ALLOWED_INPUT.has(meta.format)) {
    throw new UploadError("Поддерживаются JPG, PNG, WebP и HEIC");
  }

  const output = await sharp(input, { limitInputPixels: 60_000_000 })
    .rotate()
    .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  const name = `${randomBytes(12).toString("hex")}.webp`;
  await mkdir(UPLOADS_DIR, { recursive: true });
  await writeFile(path.join(UPLOADS_DIR, name), output);
  log.info("image saved", { name, from: meta.format, kb: Math.round(output.length / 1024) });
  return name;
}

export async function deleteImage(name: string | null | undefined) {
  if (!name || !MEDIA_NAME.test(name)) return;
  await unlink(path.join(UPLOADS_DIR, name)).catch(() => {});
}

export async function readImage(name: string): Promise<Buffer | null> {
  if (!MEDIA_NAME.test(name)) return null;
  return readFile(path.join(UPLOADS_DIR, name)).catch(() => null);
}
