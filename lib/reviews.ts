export type Review = {
  id: string;
  name: string;
  avatar: string | null;
  date: string; // ISO
  rating: number;
  text: string;
  reply: string | null;
  photos: string[];
};

export type Photo = {
  id: string;
  /** Шаблон без размера: `${base}/${size}`, size — S | M | L | XL | XXL | XXXL | orig */
  base: string;
  alt: string;
};

export type YandexData = {
  rating: number;
  reviewCount: number;
  ratingCount: number;
  reviews: Review[];
  photos: Photo[];
  link: string;
  reviewsLink: string;
  addReviewLink: string;
  updatedAt: string;
  source: "live" | "snapshot";
};

export const photoUrl = (p: Pick<Photo, "base">, size = "XXL") =>
  `${p.base}/${size}`;
