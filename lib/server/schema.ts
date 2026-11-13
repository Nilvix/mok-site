import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * Схема базы данных сайта МОК.
 * Миграции: npm run db:generate (создать) → npm run db:migrate (применить).
 */

/** Заведение: контакты и ссылка на бронь (id = "220" | "322"). */
export const venues = pgTable("venues", {
  id: text("id").primaryKey(),
  phone: text("phone").notNull(),
  hours: text("hours").notNull(),
  bookingUrl: text("booking_url").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Prize = { place: string; prize: string };

/** Блок акции/розыгрыша на первом экране — по одному на заведение. */
export const promos = pgTable("promos", {
  venueId: text("venue_id")
    .primaryKey()
    .references(() => venues.id, { onDelete: "cascade" }),
  enabled: boolean("enabled").default(true).notNull(),
  badge: text("badge").notNull(),
  title: text("title").notNull(),
  text: text("text").notNull(),
  prizes: jsonb("prizes").$type<Prize[]>().default([]).notNull(),
  counterValue: text("counter_value").notNull(),
  counterLabel: text("counter_label").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/** Карточки раздела «Всё для идеального вечера». */
export const services = pgTable(
  "services",
  {
    id: serial("id").primaryKey(),
    venueId: text("venue_id")
      .notNull()
      .references(() => venues.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    icon: text("icon").notNull(),
    title: text("title").notNull(),
    text: text("text").notNull(),
    href: text("href"),
  },
  (t) => [index("services_venue_idx").on(t.venueId, t.position)],
);

export const menuCategories = pgTable(
  "menu_categories",
  {
    id: serial("id").primaryKey(),
    venueId: text("venue_id")
      .notNull()
      .references(() => venues.id, { onDelete: "cascade" }),
    section: text("section").$type<"kitchen" | "bar">().notNull(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    volumes: jsonb("volumes").$type<string[]>(),
    /** Не используется (фото есть только у позиций) */
    photo: text("photo"),
    adultsOnly: boolean("adults_only").default(false).notNull(),
    position: integer("position").notNull(),
  },
  (t) => [uniqueIndex("menu_categories_venue_slug").on(t.venueId, t.slug)],
);

export const menuItems = pgTable(
  "menu_items",
  {
    id: serial("id").primaryKey(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => menuCategories.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    /** Цены в рублях; несколько — для разных объёмов */
    prices: jsonb("prices").$type<number[]>().notNull(),
    note: text("note"),
    /** Имя загруженного фото в UPLOADS_DIR (abc….webp) */
    photo: text("photo"),
    available: boolean("available").default(true).notNull(),
    position: integer("position").notNull(),
  },
  (t) => [index("menu_items_category_idx").on(t.categoryId, t.position)],
);

/** Администраторы сайта. Пароль — scrypt-хэш (lib/server/auth.ts). */
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  login: text("login").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
});

/** Сессии: в БД хранится только SHA-256 от токена из cookie. */
export const sessions = pgTable(
  "sessions",
  {
    tokenHash: text("token_hash").primaryKey(),
    adminId: integer("admin_id")
      .notNull()
      .references(() => admins.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ip: text("ip"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("sessions_admin_idx").on(t.adminId)],
);

/** Попытки входа — для защиты от подбора пароля. */
export const loginAttempts = pgTable(
  "login_attempts",
  {
    id: serial("id").primaryKey(),
    ip: text("ip").notNull(),
    login: text("login").notNull(),
    success: boolean("success").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("login_attempts_ip_idx").on(t.ip, t.createdAt),
    index("login_attempts_login_idx").on(t.login, t.createdAt),
  ],
);

/** Журнал действий в админке. */
export const auditLog = pgTable(
  "audit_log",
  {
    id: serial("id").primaryKey(),
    adminId: integer("admin_id").references(() => admins.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    details: jsonb("details"),
    ip: text("ip"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("audit_log_created_idx").on(t.createdAt)],
);
