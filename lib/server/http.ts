import { NextResponse, type NextRequest } from "next/server";
import { logger } from "./logger";

const log = logger("api");

/** Ошибка с HTTP-статусом — бросай её из обработчика, обёртка вернёт корректный ответ. */
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public code = "error",
  ) {
    super(message);
  }
}

export type ApiError = { error: { code: string; message: string } };

export const ok = <T>(data: T, init?: ResponseInit) => NextResponse.json(data, init);

/** IP клиента с учётом обратного прокси (nginx, Traefik и т. п.). */
export function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

type Handler<C> = (req: NextRequest, ctx: C) => Promise<Response> | Response;

/**
 * Обёртка API-роута: логирует запрос и время ответа, превращает ошибки в JSON
 * `{ error: { code, message } }` и не отдаёт наружу детали внутренних ошибок.
 */
export function route<C = unknown>(name: string, handler: Handler<C>): Handler<C> {
  return async (req, ctx) => {
    const started = Date.now();
    try {
      const res = await handler(req, ctx);
      log.debug(`${req.method} ${name}`, { status: res.status, ms: Date.now() - started });
      return res;
    } catch (e) {
      if (e instanceof HttpError) {
        log.warn(`${req.method} ${name}`, { status: e.status, code: e.code, ms: Date.now() - started });
        return NextResponse.json<ApiError>(
          { error: { code: e.code, message: e.message } },
          { status: e.status },
        );
      }
      log.error(`${req.method} ${name} failed`, { err: e, ms: Date.now() - started });
      return NextResponse.json<ApiError>(
        { error: { code: "internal", message: "Внутренняя ошибка сервера" } },
        { status: 500 },
      );
    }
  };
}
