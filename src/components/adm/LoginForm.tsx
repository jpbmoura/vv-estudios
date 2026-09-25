"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/adm/actions";
import { buttonClass } from "@/components/ui/Button";
import { errorClass, inputClass, labelClass } from "./fields";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className="mt-12 w-full max-w-sm text-left">
      <label htmlFor="password" className={labelClass}>
        Senha
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoFocus
        autoComplete="current-password"
        aria-invalid={!!state.error}
        aria-describedby={state.error ? "password-error" : undefined}
        className={inputClass}
      />
      {state.error && (
        <p id="password-error" role="alert" className={errorClass}>
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className={buttonClass("solid", "mt-8 w-full justify-center disabled:opacity-60")}>
        <span className="relative">{pending ? "Entrando…" : "Entrar"}</span>
      </button>
    </form>
  );
}
