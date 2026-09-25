import { categories, type Category } from "@/content/agenda";
import { zonedToUtc } from "./dates";

export type EventInput = {
  title: string;
  detail: string;
  startsAt: Date;
  location: string | null;
  category: Category;
  link: string | null;
};

export type FieldErrors = Partial<Record<"title" | "detail" | "date" | "time" | "location" | "category" | "link", string>>;

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

export function parseEventForm(fd: FormData): { data: EventInput } | { errors: FieldErrors } {
  const title = str(fd, "title");
  const detail = str(fd, "detail").replace(/\r\n/g, "\n");
  const date = str(fd, "date");
  const time = str(fd, "time");
  const location = str(fd, "location");
  const category = str(fd, "category");
  const link = str(fd, "link");

  const errors: FieldErrors = {};
  if (!title) errors.title = "Informe o título.";
  else if (title.length > 150) errors.title = "Máximo de 150 caracteres.";
  if (detail.length > 5000) errors.detail = "Máximo de 5000 caracteres.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.date = "Informe a data.";
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) errors.time = "Informe o horário.";
  if (location.length > 200) errors.location = "Máximo de 200 caracteres.";
  if (!categories.some((c) => c.value === category)) errors.category = "Escolha uma categoria.";
  if (link && !/^https?:\/\/\S+\.\S+$/i.test(link)) errors.link = "Use um link completo, começando com https://";

  if (Object.keys(errors).length) return { errors };

  const startsAt = zonedToUtc(date, time);
  if (Number.isNaN(startsAt.getTime())) return { errors: { date: "Data inválida." } };

  return {
    data: {
      title,
      detail,
      startsAt,
      location: location || null,
      category: category as Category,
      link: link || null,
    },
  };
}
