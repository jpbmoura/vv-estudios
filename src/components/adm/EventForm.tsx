"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { saveEvent, type EventFormState } from "@/app/adm/actions";
import { buttonClass } from "@/components/ui/Button";
import { categories, recurrenceOptions, weekdayShort } from "@/content/agenda";
import { weekdayOf } from "@/lib/agenda/dates";
import { monthlyOptions } from "@/lib/agenda/recurrence";
import type { FieldErrors } from "@/lib/agenda/validation";
import { chipClass, errorClass, inputClass, labelClass } from "./fields";

export type EventFormValues = {
  title: string;
  detail: string;
  date: string;
  time: string;
  endTime: string;
  location: string;
  category: string;
  link: string;
  /** Uma das recurrenceOptions */
  freq: string;
  /** Dias da semana marcados, "1,3" */
  weekdays: string;
  monthlyMode: string;
  until: string;
};

/** Segunda a domingo */
const WEEK = [1, 2, 3, 4, 5, 6, 0];

type Props = {
  id: string | null;
  initial: EventFormValues;
  backHref: string;
};

export function EventForm({ id, initial, backHref }: Props) {
  const [state, action, pending] = useActionState<EventFormState, FormData>(saveEvent, {});
  const values = { ...initial, ...state.values } as EventFormValues;
  // O React limpa o form depois da action; remontar (key) com os valores devolvidos mantém o que foi digitado
  return <EventFormFields key={state.attempt} id={id} values={values} backHref={backHref} state={state} action={action} pending={pending} />;
}

type FieldsProps = {
  id: string | null;
  values: EventFormValues;
  backHref: string;
  state: EventFormState;
  action: (fd: FormData) => void;
  pending: boolean;
};

function EventFormFields({ id, values, backHref, state, action, pending }: FieldsProps) {
  const errors: FieldErrors = state.errors ?? {};
  // Só o que muda a interface na hora: tipo de repetição, data (rótulos do mensal) e dias marcados
  const [freq, setFreq] = useState(values.freq || "none");
  const [date, setDate] = useState(values.date);
  const [weekdays, setWeekdays] = useState(() => new Set(values.weekdays.split(",").filter(Boolean).map(Number)));

  const weekly = freq === "weekly" || freq === "biweekly";
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date);
  const monthly = validDate ? monthlyOptions(date) : {};

  const changeFreq = (next: string) => {
    setFreq(next);
    // Ao escolher semanal sem nenhum dia, já marca o dia da data de início
    if ((next === "weekly" || next === "biweekly") && weekdays.size === 0 && validDate) setWeekdays(new Set([weekdayOf(date)]));
  };
  const toggleDay = (day: number) =>
    setWeekdays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });

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
    <form action={action} className="grid max-w-3xl gap-7 md:grid-cols-2">
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
          {freq === "none" ? "Data *" : "Começa em *"}
        </label>
        <input {...field("date")} type="date" value={date} onChange={(e) => setDate(e.target.value)} required className={inputClass} />
        {error("date")}
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

      <fieldset className="grid gap-6 border border-line p-6 md:col-span-2 md:grid-cols-2">
        <legend className="px-2 text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-gold-light">Repetição</legend>

        <div>
          <label htmlFor="freq" className={labelClass}>
            Repete
          </label>
          <select {...field("freq")} value={freq} onChange={(e) => changeFreq(e.target.value)} className={inputClass}>
            {recurrenceOptions.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          {error("freq")}
        </div>

        <div hidden={freq === "none"}>
          <label htmlFor="until" className={labelClass}>
            Até (opcional)
          </label>
          <input {...field("until")} type="date" defaultValue={values.until} min={validDate ? date : undefined} className={inputClass} />
          {error("until")}
        </div>

        <div hidden={!weekly} className="md:col-span-2">
          <p className={labelClass}>Dias da semana *</p>
          <div role="group" aria-label="Dias da semana" className="flex flex-wrap gap-2">
            {WEEK.map((day) => (
              <label key={day} className={chipClass}>
                <input
                  type="checkbox"
                  name="weekdays"
                  value={day}
                  checked={weekdays.has(day)}
                  onChange={() => toggleDay(day)}
                  disabled={!weekly}
                  className="sr-only"
                />
                {weekdayShort[day]}
              </label>
            ))}
          </div>
          {error("weekdays")}
        </div>

        <div hidden={freq !== "monthly"} className="md:col-span-2">
          <p className={labelClass}>No mês *</p>
          <div role="radiogroup" aria-label="Como se repete no mês" className="flex flex-wrap gap-2">
            {Object.entries(monthly).map(([mode, label]) => (
              <label key={mode} className={chipClass}>
                <input
                  type="radio"
                  name="monthlyMode"
                  value={mode}
                  defaultChecked={(values.monthlyMode || "day") === mode}
                  disabled={freq !== "monthly"}
                  className="sr-only"
                />
                {label}
              </label>
            ))}
          </div>
          {error("monthlyMode")}
        </div>

        {id && freq !== "none" && (
          <p className="text-sm text-mute md:col-span-2">
            As alterações valem para todas as datas da série. Para mudar ou cancelar um dia só, use “Alterar” na lista de datas.
          </p>
        )}
      </fieldset>

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
