import { readImage } from "@/lib/server/media";

/** Отдаёт загруженные в админке фото: /media/<имя>.webp */
export async function GET(_: Request, { params }: { params: { file: string } }) {
  const data = await readImage(params.file);
  if (!data) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": "image/webp",
      // Имя файла уникально для каждого фото, поэтому кэшировать можно «навсегда»
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
