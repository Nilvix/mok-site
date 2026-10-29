import { ok, route } from "@/lib/server/http";

export const dynamic = "force-dynamic";

/** Проверка живости для Docker HEALTHCHECK, балансировщика и мониторинга. */
export const GET = route("/api/health", () =>
  ok(
    {
      status: "ok",
      version: process.env.APP_VERSION ?? "dev",
      uptime: Math.round(process.uptime()),
      time: new Date().toISOString(),
    },
    { headers: { "Cache-Control": "no-store" } },
  ),
);
