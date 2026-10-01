export const categories = [
  { value: "espetaculo", label: "Espetáculo" },
  { value: "estreia", label: "Estreia" },
  { value: "aula", label: "Aula" },
  { value: "oficina", label: "Oficina" },
  { value: "audicao", label: "Audição" },
  { value: "outro", label: "Outro" },
] as const;

export type Category = (typeof categories)[number]["value"];

export function categoryLabel(value: string) {
  return categories.find((c) => c.value === value)?.label ?? "Evento";
}

export const agenda = {
  eyebrow: "Agenda",
  title: "O que está em cartaz.",
  lead: "Espetáculos, estreias, aulas abertas e oficinas. Acompanhe mês a mês tudo o que acontece no estúdio.",
  empty: {
    title: "Nenhum evento neste mês.",
    body: "A programação ainda está sendo preparada. Fale com a gente para saber das próximas turmas e apresentações.",
  },
  upcoming: {
    eyebrow: "Em cartaz",
    title: "Próximos eventos",
  },
};

export { weekdayNames, weekdayShort } from "./weekdays";

/** Opções de repetição do form do /adm (quinzenal = semanal a cada 2 semanas) */
export const recurrenceOptions = [
  { value: "none", label: "Não se repete" },
  { value: "daily", label: "Todos os dias" },
  { value: "weekly", label: "Semanal" },
  { value: "biweekly", label: "Quinzenal" },
  { value: "monthly", label: "Mensal" },
] as const;

export type RecurrenceOption = (typeof recurrenceOptions)[number]["value"];

export const occurrenceLabels = {
  cancelled: "Cancelada",
  modified: "Horário especial",
};

/** Abas do /adm */
export const adminViews = {
  tabs: [
    { value: "lista", label: "Lista" },
    { value: "calendario", label: "Calendário" },
  ],
  calendarHint: "Clique num evento para alterar ou cancelar só aquela data.",
  hidden: "Pré-visualização: a agenda está oculta no site.",
} as const;

export type AdminView = (typeof adminViews.tabs)[number]["value"];
