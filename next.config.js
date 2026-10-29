const { version } = require("./package.json");

/**
 * Две цели сборки:
 *  - по умолчанию — сервер Next.js (Docker, output: "standalone"), с API и оптимизацией картинок;
 *  - GITHUB_PAGES=true — статический сайт в папке out/ для GitHub Pages (без API-роутов).
 */
const isPages = process.env.GITHUB_PAGES === "true";
// Префикс пути на GitHub Pages: https://<user>.github.io/<repo>/ → "/<repo>"
const basePath = process.env.NEXT_BASE_PATH || "";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  // Браузер учитывает HSTS только по HTTPS, поэтому на localhost заголовок безвреден
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: { APP_VERSION: version },
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // API-роуты лежат в файлах route.api.ts — в статической сборке они просто не подхватываются
  pageExtensions: isPages ? ["tsx", "ts"] : ["api.ts", "tsx", "ts"],
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
