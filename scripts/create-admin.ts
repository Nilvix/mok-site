// Создать администратора или сменить ему пароль:
//   npm run admin:create -- <логин>
// Пароль спрашивается в терминале и нигде не сохраняется в открытом виде.
import { createInterface } from "node:readline/promises";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../lib/server/schema";
import { hashPassword, passwordProblem } from "../lib/server/password";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL не задан");
  const login = process.argv[2]?.trim();
  if (!login) throw new Error("Укажи логин: npm run admin:create -- <логин>");

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const password = process.env.ADMIN_PASSWORD ?? (await rl.question("Новый пароль (от 12 символов, буквы и цифры): "));
  rl.close();
  const problem = passwordProblem(password);
  if (problem) throw new Error(problem);

  const client = postgres(url, { max: 1 });
  const db = drizzle(client, { schema });
  const passwordHash = await hashPassword(password);
  const [existing] = await db.select().from(schema.admins).where(eq(schema.admins.login, login));
  if (existing) {
    await db.update(schema.admins).set({ passwordHash }).where(eq(schema.admins.id, existing.id));
    await db.delete(schema.sessions).where(eq(schema.sessions.adminId, existing.id));
    console.log(`Пароль для "${login}" обновлён, все его сессии завершены.`);
  } else {
    await db.insert(schema.admins).values({ login, passwordHash });
    console.log(`Администратор "${login}" создан.`);
  }
  await client.end();
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
