"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveEvent, type EventFormState } from "@/app/adm/actions";
import { buttonClass } from "@/components/ui/Button";
import { categories } from "@/content/agenda";
import type { FieldErrors } from "@/lib/agenda/validation";
import { errorClass, inputClass, labelClass } from "./fields";

export type EventFormValues = {
  title: string;
  detail: string;
  date: string;
  time: string;
  location: string;
  category: string;
  link: string;
};

type Props = {
  id: string | null;
  initial: EventFormValues;
  backHref: string;
};

export function EventForm({ id, initial, backHref }: Props) {
  const [state, action, pending] = useActionState<EventFormState, FormData>(saveEvent, {});
  const errors: FieldErrors = state.errors ?? {};
  const values = { ...initial, ...state.values } as EventFormValues;

  const field = (name: keyof FieldErrors) => ({
    id: name,
    name,
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });
  const error = (name: keyof FieldErrors) =>
    errors[name] && (
      <p id={`${name}-error`} className={errorClass}>
        {errors[name]}
      </p>
    );

  return (
    // O React limpa o form depois da action; remontar (key) com os valores devolvidos mantém o que foi digitado
    <form key={state.attempt} action={action} className="grid max-w-3xl gap-7 md:grid-cols-2">
      {id && <input type="hidden" name="id" value={id} />}
      <div className="md:col-span-2">
        <label htmlFor="title" className={labelClass}>
          Título *
        </label>
        <input {...field("title")} defaultValue={values.title} required maxLength={150} className={inputClass} />
        {error("title")}
      </div>

      <div>
        <label htmlFor="date" className={labelClass}>
          Data *
        </label>
        <input {...field("date")} type="date" defaultValue={values.date} required className={inputClass} />
        {error("date")}
      </div>

      <div>
        <label htmlFor="time" className={labelClass}>
          Horário de início *
        </label>
        <input {...field("time")} type="time" defaultValue={values.time} required className={inputClass} />
        {error("time")}
      </div>

      <div>
        <label htmlFor="category" className={labelClass}>
          Categoria *
        </label>
        <select {...field("category")} defaultValue={values.category} required className={inputClass}>
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        {error("category")}
      </div>

      <div>
        <label htmlFor="location" className={labelClass}>
          Local
        </label>
        <input {...field("location")} defaultValue={values.location} maxLength={200} placeholder="Ex.: Sala principal do estúdio" className={inputClass} />
        {error("location")}
      </div>

      <div className="md:col-span-2">
        <label htmlFor="link" className={labelClass}>
          Link (ingressos, inscrição)
        </label>
        <input {...field("link")} type="url" defaultValue={values.link} placeholder="https://" className={inputClass} />
        {error("link")}
      </div>

      <div className="md:col-span-2">
        <label htmlFor="detail" className={labelClass}>
          Detalhe
        </label>
        <textarea {...field("detail")} defaultValue={values.detail} rows={8} maxLength={5000} className={`${inputClass} resize-y leading-relaxed`} />
        {error("detail")}
      </div>

      {state.message && (
        <p role="alert" className="text-sm text-red-300 md:col-span-2">
          {state.message}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-8 md:col-span-2">
        <button type="submit" disabled={pending} className={buttonClass("solid", "cursor-pointer disabled:opacity-60")}>
          <span className="relative">{pending ? "Salvando…" : id ? "Salvar alterações" : "Cadastrar evento"}</span>
        </button>
        <Link href={backHref} className="link-underline pb-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-bone/70 hover:text-bone">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
