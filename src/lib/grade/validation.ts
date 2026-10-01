import { checkTimes } from "@/lib/time";

export type ClassInput = {
  title: string;
  weekdays: number[];
  startTime: string;
  endTime: string;
  biweekly: boolean;
  active: boolean;
};

export type ClassFieldErrors = Partial<Record<"title" | "weekdays" | "time" | "endTime", string>>;

export function parseClassForm(fd: FormData): { data: ClassInput } | { errors: ClassFieldErrors } {
  const title = String(fd.get("title") ?? "").trim();
  const time = String(fd.get("time") ?? "").trim();
  const endTime = String(fd.get("endTime") ?? "").trim();
  const weekdays = [...new Set(fd.getAll("weekdays").map(Number))].filter((d) => Number.isInteger(d) && d >= 0 && d <= 6).sort();

  const errors: ClassFieldErrors = {};
  if (!title) errors.title = "Informe o nome da aula.";
  else if (title.length > 150) errors.title = "Máximo de 150 caracteres.";
  if (weekdays.length === 0) errors.weekdays = "Marque pelo menos um dia.";
  checkTimes(time, endTime, errors);
  if (Object.keys(errors).length > 0) return { errors };

  return {
    data: {
      title,
      weekdays,
      startTime: time,
      endTime,
      biweekly: fd.get("biweekly") === "on",
      active: fd.get("active") === "on",
    },
  };
}
