import { bootstrapDatabase } from "./bootstrap";
import { logger } from "./logger";

export async function startDatabase() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url || process.env.GITHUB_PAGES === "true") return;
  const log = logger("db");
  try {
    await bootstrapDatabase(url, (m) => log.info(m));
  } catch (e) {
    log.error("database bootstrap failed", { err: e });
  }
}
