# МОК — сайт ресто-лаунжа

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion.
Отзывы, рейтинг и фото подтягиваются с Яндекс Карт, бронирование — через Axle.

## Разработка

```bash
npm install
cp .env.example .env.local   # при необходимости
npm run dev                  # http://localhost:3000
```

## Продакшен в Docker

```bash
cp .env.example .env         # заполни POSTGRES_PASSWORD, ADMIN_LOGIN/ADMIN_PASSWORD, SITE_URL
docker compose --profile prod up -d --build   # nginx + сайт + база + бэкапы, http://localhost
docker compose logs -f web   # логи (JSON, по строке на событие)
```

Образ собирается в три этапа (`Dockerfile`): зависимости → сборка → минимальный рантайм
на `node:20-alpine` с `output: "standalone"`. Контейнер работает от непривилегированного
пользователя, сам проверяет здоровье через `/api/health`, кэш Next.js хранится в томе
`next-cache`.

Без Docker:

```bash
npm run build
cp -R .next/static .next/standalone/.next/static
npm run start:standalone     # PORT=3000 по умолчанию
```

На сервере перед контейнером ставится обратный прокси с HTTPS (nginx, Caddy или Traefik),
который проксирует на порт 3000.

## База данных и админ-панель

- **PostgreSQL 16** в Docker, ORM — Drizzle (`lib/server/schema.ts`, миграции в `drizzle/`).
- При старте сервера (`instrumentation.ts`) автоматически применяются миграции, пустая база
  заполняется данными по умолчанию (`lib/venues.ts`, `lib/menu-220.ts`), а из `ADMIN_LOGIN` /
  `ADMIN_PASSWORD` создаётся первый администратор.
- Без `DATABASE_URL` сайт работает на данных по умолчанию (так собирается GitHub Pages).

**Меню** открывается всплывающим окном (`components/menu/`) — по карточкам «Кухня» и
«Лимонады…» (ссылка `menu:kitchen` / `menu:bar`), пункту «Меню» в шапке или по адресу `…/#menu`.

**Фото блюд** загружаются в админке: принимаются JPG/PNG/WebP/HEIC до 10 МБ, сайт проверяет,
что это действительно картинка, поворачивает по EXIF, уменьшает до 1200 px, убирает метаданные
и сохраняет в WebP (`lib/server/media.ts`). Файлы лежат в `UPLOADS_DIR` (в Docker — том `uploads`),
раздаются по `/media/<имя>.webp` и попадают в ежедневный бэкап.

**Админ-панель:** `/admin` (незаметная ссылка — значок «©» в футере). Там:
акция на первом экране, контакты и ссылка на бронь, карточки услуг, меню (цены, наличие,
порядок, разделы) и загрузка фото к каждому блюду. Изменения появляются на сайте сразу после сохранения.

Защита: пароль хранится как scrypt-хэш; сессия — случайный токен в httpOnly-cookie
(в базе только его SHA-256), живёт 12 часов; 5 неудачных входов с одного IP или 10 на один
логин — блокировка на 15 минут; все действия пишутся в журнал (`audit_log`);
формы проверяются на сервере (zod), Server Actions защищены от CSRF проверкой Origin.

```bash
docker compose up -d db                 # база для разработки на 127.0.0.1:5432
npm run db:migrate                      # миграции и начальные данные вручную
npm run admin:create -- <логин>         # создать админа или сменить пароль
npm run db:generate                     # новая миграция после правки schema.ts
```

Бэкапы в продакшене: `docker compose --profile prod up -d` поднимает сервис `backup`,
который раз в сутки делает `pg_dump` в `./backups/` и хранит 14 дней.

> Не запускайте `npm run build:pages` при работающем `npm run dev` — сборки мешают друг другу;
> после неё перезапустите dev-сервер.

## GitHub Pages (статическая версия)

Сайт публикуется на https://nilvix.github.io/mok-site/ через GitHub Actions
(`.github/workflows/pages.yml`): при каждом пуше в `main`, вручную («Run workflow») и раз в сутки,
чтобы подтянуть свежие отзывы и фото с Яндекс Карт.

GitHub Pages отдаёт только статические файлы, поэтому в этой версии нет API-роутов
(`/api/*`) и серверной оптимизации картинок — фото грузятся напрямую с Яндекса.
Полная версия с бэкендом — Docker.

Собрать статику локально:

```bash
GITHUB_PAGES=true NEXT_BASE_PATH=/mok-site npm run build:pages   # → .next-pages/
```

## Защита

- **nginx** (`deploy/nginx/nginx.conf`, сервис `proxy`, профиль `prod`) стоит перед сайтом:
  - лимиты с одного IP: страницы — 20 запросов/с, админка — 5/с, вход — 10 в минуту, API — 2/с;
    не более 30 одновременных соединений;
  - короткие таймауты и лимит тела 1 МБ (защита от «медленных» атак вроде Slowloris);
  - запросы сканеров (`.env`, `.git`, `wp-login`, `*.php`) обрываются без ответа;
  - nginx перезаписывает `X-Real-IP`, поэтому клиент не может подменить свой IP и обойти лимиты входа.
- Сайт напрямую слушает только `127.0.0.1` — снаружи доступен лишь через nginx.
- Заголовки: Content-Security-Policy (скрипты только свои, картинки — свои и Яндекса,
  встраивание — только карта Яндекса), HSTS, X-Frame-Options, Permissions-Policy и др.
- От объёмных DDoS-атак (L3/L4) защищает хостинг-провайдер; для серьёзной защиты —
  платная услуга провайдера или сервис вроде DDoS-Guard/Qrator.

## Переменные окружения

| Переменная          | Назначение                                                        |
| ------------------- | ----------------------------------------------------------------- |
| `SITE_URL`          | Публичный адрес сайта                                             |
| `PORT`              | Внешний порт в `docker compose` (по умолчанию 3000)               |
| `LOG_LEVEL`         | `debug` / `info` / `warn` / `error`                               |
| `REVALIDATE_SECRET` | Секрет для `POST /api/revalidate`; пусто — эндпоинт выключен      |
| `APIFY_TOKEN`       | Зарезервировано, сейчас не используется                           |

Все переменные читаются только через `lib/server/env.ts`.

## API

| Метод | Путь              | Описание                                                       |
| ----- | ----------------- | -------------------------------------------------------------- |
| GET   | `/api/health`     | Проверка живости: статус, версия, uptime                       |
| GET   | `/api/yandex`     | Отзывы, рейтинг и фото с Яндекс Карт (кэш 6 ч)                 |
| POST  | `/api/revalidate` | Сбросить кэш данных Яндекса. `Authorization: Bearer <секрет>`  |

```bash
curl -X POST -H "Authorization: Bearer $REVALIDATE_SECRET" https://mok-cherkessk.ru/api/revalidate
```

## Структура бэкенда

```
app/api/<имя>/route.api.ts — HTTP-эндпоинты (суффикс .api — чтобы статическая сборка их пропускала)
lib/server/env.ts        — переменные окружения с проверкой
lib/server/logger.ts     — логгер (JSON в продакшене)
lib/server/http.ts       — route() — обёртка роутов, HttpError, ok(), clientIp()
lib/server/rate-limit.ts — ограничение частоты запросов (в памяти)
lib/yandex.ts            — загрузка данных с Яндекс Карт + резервный снимок
```

Новый эндпоинт:

```ts
// app/api/example/route.api.ts
import { HttpError, ok, route } from "@/lib/server/http";

export const POST = route("/api/example", async (req) => {
  const body = await req.json().catch(() => null);
  if (!body?.name) throw new HttpError(400, "Поле name обязательно", "validation");
  return ok({ hello: body.name });
});
```

В `docker-compose.yml` есть закомментированная заготовка PostgreSQL — на случай, если
понадобится хранить данные (заявки, акции и т. п.).

## Контент

- Контакты, часы работы, соцсети, ссылка на бронь, реквизиты — `lib/site-config.ts`
- Резервный снимок данных Яндекса — `lib/yandex-snapshot.json`, обновить: `npm run sync:yandex`
  (при запущенном dev-сервере)
