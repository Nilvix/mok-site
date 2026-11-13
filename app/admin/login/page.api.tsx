import { redirect } from "next/navigation";
import { LogoMark } from "@/components/ui/LogoMark";
import { getAdmin } from "@/lib/server/auth";
import { getDb } from "@/lib/server/db";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  if (!getDb()) {
    return <p className="p-10 text-white/60">База данных не подключена — админ-панель недоступна.</p>;
  }
  if (await getAdmin()) redirect("/admin");
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.02] p-7">
        <LogoMark className="w-24" />
        <h1 className="mt-6 text-xl font-bold">Вход для администратора</h1>
        <p className="mt-1 text-sm text-white/45">После 5 неудачных попыток вход блокируется на 15 минут.</p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
