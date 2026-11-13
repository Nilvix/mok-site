"use client";

import { useFormState } from "react-dom";
import { loginAction, type LoginState } from "../actions";
import { SubmitButton } from "@/components/admin/buttons";
import { Field, inputCls } from "@/components/admin/ui";

export function LoginForm() {
  const [state, action] = useFormState<LoginState, FormData>(loginAction, {});
  return (
    <form action={action} className="space-y-4">
      {state.error && (
        <div role="alert" className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {state.error}
        </div>
      )}
      <Field label="Логин">
        <input name="login" autoComplete="username" required maxLength={100} className={inputCls} />
      </Field>
      <Field label="Пароль">
        <input name="password" type="password" autoComplete="current-password" required maxLength={200} className={inputCls} />
      </Field>
      <SubmitButton className="w-full">Войти</SubmitButton>
    </form>
  );
}
