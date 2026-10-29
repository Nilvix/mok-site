import { env } from "./env";

type Level = "debug" | "info" | "warn" | "error";
type Fields = Record<string, unknown>;

const ORDER: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };

function serialize(fields: Fields): Fields {
  const out: Fields = {};
  for (const [k, v] of Object.entries(fields)) {
    out[k] = v instanceof Error ? { name: v.name, message: v.message, stack: v.stack } : v;
  }
  return out;
}

function write(level: Level, scope: string, msg: string, fields: Fields = {}) {
  if (ORDER[level] < ORDER[env.LOG_LEVEL]) return;
  const stream = level === "error" || level === "warn" ? console.error : console.log;

  if (env.isProd) {
    // Одна строка JSON на событие — удобно для `docker logs` и сборщиков логов.
    stream(JSON.stringify({ time: new Date().toISOString(), level, scope, msg, ...serialize(fields) }));
  } else {
    const extra = Object.keys(fields).length ? fields : "";
    stream(`[${level}] ${scope}: ${msg}`, extra);
  }
}

/** Логгер с областью: `const log = logger("yandex"); log.info("...", { ms })`. */
export function logger(scope: string) {
  return {
    debug: (msg: string, f?: Fields) => write("debug", scope, msg, f),
    info: (msg: string, f?: Fields) => write("info", scope, msg, f),
    warn: (msg: string, f?: Fields) => write("warn", scope, msg, f),
    error: (msg: string, f?: Fields) => write("error", scope, msg, f),
  };
}
