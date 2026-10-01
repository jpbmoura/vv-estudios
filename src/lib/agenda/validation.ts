import { categories, recurrenceOptions, type Category, type RecurrenceOption } from "@/content/agenda";
import { checkTimes } from "@/lib/time";
import { monthlyOptions } from "./recurrence";
import type { Freq, MonthlyMode } from "./types";

export type EventInput = {
  title: string;
  detail: string;
  location: string | null;
  category: Category;
  link: string | null;
  startDate: string;
  startTime: string;
  endTime: string;
  freq: Freq;
  repeatEvery: number;
  weekdays: number[];
  monthlyMode: MonthlyMode | null;
  untilDate: string | null;
};

export type FieldErrors = Partial<
  Record<"title" | "detail" | "date" | "time" | "endTime" | "location" | "category" | "link" | "freq" | "weekdays" | "monthlyMode" | "until", string>
>;

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const isDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v);

export function parseEventForm(fd: FormData): { data: EventInput } | { errors: FieldErrors } {
  const title = str(fd, "title");
  const detail = str(fd, "detail").replace(/\r\n/g, "\n");
  const date = str(fd, "date");
  const time = str(fd, "time");
  const endTime = str(fd, "endTime");
  const location = str(fd, "location");
  const category = str(fd, "category");
  const link = str(fd, "link");
  const recurrence = str(fd, "freq") || "none";
  const weekdays = [...new Set(fd.getAll("weekdays").map(Number))].filter((d) => Number.isInteger(d) && d >= 0 && d <= 6).sort();
  const monthlyMode = str(fd, "monthlyMode");
  const until = str(fd, "until");

  const errors: FieldErrors = {};
  if (!title) errors.title = "Informe o título.";
  else if (title.length > 150) errors.title = "Máximo de 150 caracteres.";
  if (detail.length > 5000) errors.detail = "Máximo de 5000 caracteres.";
  if (!isDate(date)) errors.date = "Informe a data.";
  checkTimes(time, endTime, errors);
  if (location.length > 200) errors.location = "Máximo de 200 caracteres.";
  if (!categories.some((c) => c.value === category)) errors.category = "Escolha uma categoria.";
  if (link && !/^https?:\/\/\S+\.\S+$/i.test(link)) errors.link = "Use um link completo, começando com https://";

  if (!recurrenceOptions.some((r) => r.value === recurrence)) errors.freq = "Escolha como o evento se repete.";
  const option = recurrence as RecurrenceOption;
  const repeats = option !== "none";
  const weekly = option === "weekly" || option === "biweekly";
  if (weekly && weekdays.length === 0) errors.weekdays = "Escolha ao menos um dia da semana.";
  if (option === "monthly" && isDate(date) && !(monthlyMode in monthlyOptions(date))) errors.monthlyMode = "Escolha como o evento se repete no mês.";
  if (repeats && until) {
    if (!isDate(until)) errors.until = "Data inválida.";
    else if (isDate(date) && until < date) errors.until = "Deve ser igual ou depois da data de início.";
  }

  if (Object.keys(errors).length) return { errors };

  return {
    data: {
      title,
      detail,
      location: location || null,
      category: category as Category,
      link: link || null,
      startDate: date,
      startTime: time,
      endTime,
      freq: option === "biweekly" ? "weekly" : option,
      repeatEvery: option === "biweekly" ? 2 : 1,
      weekdays: weekly ? weekdays : [],
      monthlyMode: option === "monthly" ? (monthlyMode as MonthlyMode) : null,
      untilDate: repeats && until ? until : null,
    },
  };
}

export type OccurrenceInput = {
  title: string;
  detail: string;
  location: string | null;
  startTime: string;
  endTime: string;
};

/** Alteração de uma única data de uma série */
export function parseOccurrenceForm(fd: FormData): { data: OccurrenceInput } | { errors: FieldErrors } {
  const title = str(fd, "title");
  const detail = str(fd, "detail").replace(/\r\n/g, "\n");
  const location = str(fd, "location");
  const time = str(fd, "time");
  const endTime = str(fd, "endTime");

  const errors: FieldErrors = {};
  if (!title) errors.title = "Informe o título.";
  else if (title.length > 150) errors.title = "Máximo de 150 caracteres.";
  if (detail.length > 5000) errors.detail = "Máximo de 5000 caracteres.";
  if (location.length > 200) errors.location = "Máximo de 200 caracteres.";
  checkTimes(time, endTime, errors);

  if (Object.keys(errors).length) return { errors };
  return { data: { title, detail, location: location || null, startTime: time, endTime } };
}
