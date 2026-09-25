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
