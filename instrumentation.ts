/**
 * Выполняется один раз при старте сервера Next.js:
 * применяет миграции, заполняет пустую базу и создаёт первого администратора.
 */
export async function register() {
  // Проверка именно в таком виде позволяет сборщику выкинуть Node-код из edge-сборки
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startDatabase } = await import("./lib/server/start");
    await startDatabase();
  }
}
