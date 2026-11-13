const { version } = require("./package.json");

/**
 * Две цели сборки:
 *  - по умолчанию — сервер Next.js (Docker, output: "standalone"), с API и оптимизацией картинок;
 *  - GITHUB_PAGES=true — статический сайт в папке out/ для GitHub Pages (без API-роутов).
 */
const isPages = process.env.GITHUB_PAGES === "true";
// Префикс пути на GitHub Pages: https://<user>.github.io/<repo>/ → "/<repo>"
const basePath = process.env.NEXT_BASE_PATH || "";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content-Security-Policy: страница может загружать скрипты только с нашего сайта,
 * картинки — с нашего сайта и Яндекса, встраивать — только карту Яндекса.
 * 'unsafe-inline' для скриптов нужен Next.js 14 без nonce; 'unsafe-eval' и ws: — только в разработке.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://avatars.mds.yandex.net https://*.yandex.net https://*.yandex.ru",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "frame-src https://yandex.ru https://*.yandex.ru",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  // Браузер учитывает HSTS только по HTTPS, поэтому на localhost заголовок безвреден
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    APP_VERSION: version,
    // Скрытая ссылка на админку в футере — только там, где админка есть (не на GitHub Pages)
    NEXT_PUBLIC_ADMIN_ENABLED: isPages ? "" : "1",
  },
  experimental: {
    // instrumentation.ts: миграции и подготовка базы при старте сервера
    instrumentationHook: true,
    serverComponentsExternalPackages: ["postgres", "sharp"],
    // Загрузка фото блюд из админки
    serverActions: { bodySizeLimit: "12mb" },
  },
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // API и админка лежат в файлах *.api.ts / *.api.tsx — в статической сборке они не подхватываются
  pageExtensions: isPages ? ["tsx", "ts"] : ["api.ts", "api.tsx", "tsx", "ts"],
  images: {
    // На GitHub Pages нет сервера для оптимизации — картинки отдаются напрямую с Яндекса
    unoptimized: isPages,
    formats: ["image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.mds.yandex.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
  ...(isPages
    ? {
        output: "export",
        // Готовый статический сайт окажется в .next-pages/ (не мешает запущенному dev-серверу)
        distDir: ".next-pages",
        basePath,
        trailingSlash: true,
      }
    : {
        // Самодостаточная сборка для Docker: .next/standalone + server.js
        output: "standalone",
        async headers() {
          return [{ source: "/(.*)", headers: securityHeaders }];
        },
      }),
};

module.exports = nextConfig;
