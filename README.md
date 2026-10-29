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
cp .env.example .env         # заполни SITE_URL, REVALIDATE_SECRET
docker compose up -d --build # http://localhost:3000
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
