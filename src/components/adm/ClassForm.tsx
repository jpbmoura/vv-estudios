"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveClass, type ClassFormState } from "@/app/adm/grade-actions";
import { buttonClass } from "@/components/ui/Button";
import { WEEK, weekdayShort } from "@/content/weekdays";
import type { ClassFieldErrors } from "@/lib/grade/validation";
import { chipClass, errorClass, inputClass, labelClass } from "./fields";

export type ClassFormValues = {
  title: string;
  /** Dias marcados, "1,3" */
  weekdays: string;
  time: string;
  endTime: string;
  /** "true" | "false" */
  biweekly: string;
  active: string;
};

export function ClassForm({ id, initial }: { id: string | null; initial: ClassFormValues }) {
  const [state, action, pending] = useActionState<ClassFormState, FormData>(saveClass, {});
  const values = { ...initial, ...state.values } as ClassFormValues;
  // O React limpa o form depois da action; remontar (key) com os valores devolvidos mantém o que foi digitado
  return <ClassFormFields key={state.attempt} id={id} values={values} state={state} action={action} pending={pending} />;
}

type FieldsProps = {
  id: string | null;
  values: ClassFormValues;
  state: ClassFormState;
  action: (fd: FormData) => void;
  pending: boolean;
};

function ClassFormFields({ id, values, state, action, pending }: FieldsProps) {
  const errors: ClassFieldErrors = state.errors ?? {};
  const checkedDays = new Set(values.weekdays.split(",").filter(Boolean).map(Number));

  const field = (name: keyof ClassFieldErrors) => ({
    id: name,
    name,
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });
  const error = (name: keyof ClassFieldErrors) =>
    errors[name] && (
      <p id={`${name}-error`} className={errorClass}>
        {errors[name]}
      </p>
    );

  return (
    <form action={action} className="grid max-w-3xl gap-7 md:grid-cols-2">
      {id && <input type="hidden" name="id" value={id} />}
      <div className="md:col-span-2">
        <label htmlFor="title" className={labelClass}>
          Aula *
        </label>
        <input {...field("title")} defaultValue={values.title} required maxLength={150} placeholder="Ex.: Teatro Musical" className={inputClass} />
        {error("title")}
      </div>

      <div className="md:col-span-2">
        <p className={labelClass}>Dias da semana *</p>
        <div role="group" aria-label="Dias da semana" className="flex flex-wrap gap-2">
          {WEEK.map((day) => (
            <label key={day} className={chipClass}>
              <input type="checkbox" name="weekdays" value={day} defaultChecked={checkedDays.has(day)} className="sr-only" />
              {weekdayShort[day]}
            </label>
          ))}
        </div>
        {error("weekdays")}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="time" className={labelClass}>
            Início *
          </label>
          <input {...field("time")} type="time" defaultValue={values.time} required className={inputClass} />
          {error("time")}
        </div>
        <div>
          <label htmlFor="endTime" className={labelClass}>
            Término *
          </label>
          <input {...field("endTime")} type="time" defaultValue={values.endTime} required className={inputClass} />
          {error("endTime")}
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <label className={chipClass}>
          <input type="checkbox" name="biweekly" defaultChecked={values.biweekly === "true"} className="sr-only" />
          Quinzenal
        </label>
        <label className={chipClass}>
          <input type="checkbox" name="active" defaultChecked={values.active === "true"} className="sr-only" />
          No ar
        </label>
      </div>

      <p className="text-sm text-mute md:col-span-2">
        Desmarque “No ar” para pausar a turma: ela some da página da Escola e continua aqui para ser reativada.
      </p>

      {state.message && (
        <p role="alert" className="text-sm text-red-300 md:col-span-2">
          {state.message}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-8 md:col-span-2">
        <button type="submit" disabled={pending} className={buttonClass("solid", "cursor-pointer disabled:opacity-60")}>
          <span className="relative">{pending ? "Salvando…" : id ? "Salvar alterações" : "Cadastrar aula"}</span>
        </button>
        <Link href="/adm/grade" className="link-underline pb-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-bone/70 hover:text-bone">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
