// Применить миграции и заполнить пустую базу: npm run db:migrate
import { bootstrapDatabase } from "../lib/server/bootstrap";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL не задан");
  await bootstrapDatabase(url);
  console.log("Готово");
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
