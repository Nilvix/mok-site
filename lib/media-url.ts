/** Имя загруженного файла: 24 символа a-z0-9 + .webp */
export const MEDIA_NAME = /^[a-z0-9]{24}\.webp$/;

/** Адрес загруженного фото на сайте (или undefined, если фото нет). */
export function mediaUrl(name: string | null | undefined): string | undefined {
  return name && MEDIA_NAME.test(name) ? `/media/${name}` : undefined;
}
