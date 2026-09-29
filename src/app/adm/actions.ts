"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { eventExceptions, events } from "@/db/schema";
import { checkPassword, createSession, destroySession, requireAdmin } from "@/lib/auth";
import { EVENTS_TAG, getEventById } from "@/lib/agenda/queries";
import { isSeriesDate } from "@/lib/agenda/recurrence";
import { parseEventForm, parseOccurrenceForm, type FieldErrors } from "@/lib/agenda/validation";
import { SETTINGS_TAG, setAgendaEnabled } from "@/lib/settings";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!checkPassword(String(formData.get("password") ?? ""))) return { error: "Senha incorreta." };
  await createSession();
  redirect("/adm");
}

export async function logout() {
  await destroySession();
  redirect("/adm/login");
}

export type EventFormState = {
  errors?: FieldErrors;
  message?: string;
  /** O que foi digitado, para o form não voltar vazio depois de um erro */
  values?: Record<string, string>;
  /** Muda a cada tentativa: o form remonta com os valores acima */
  attempt?: number;
};

const FORM_KEYS = ["title", "detail", "date", "time", "endTime", "location", "category", "link", "freq", "monthlyMode", "until"];

function echo(formData: FormData) {
  const values: Record<string, string> = {};
  for (const key of FORM_KEYS) values[key] = String(formData.get(key) ?? "");
  // Checkboxes: vários valores, voltam como "1,3"
  values.weekdays = formData.getAll("weekdays").map(String).join(",");
  return { values, attempt: Date.now() };
}

/** Site público e home leem do cache: invalida tudo que mostra eventos */
function refreshAgenda() {
  updateTag(EVENTS_TAG);
  revalidatePath("/agenda");
  revalidatePath("/escola");
  revalidatePath("/");
}

export async function saveEvent(_prev: EventFormState, formData: FormData): Promise<EventFormState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "") || null;
  if (id && !/^[0-9a-f-]{36}$/i.test(id)) return { message: "Evento inválido." };
  const parsed = parseEventForm(formData);
  if ("errors" in parsed) return { errors: parsed.errors, ...echo(formData) };

  try {
    if (id) {
      await db()
        .update(events)
        .set({ ...parsed.data, updatedAt: new Date() })
        .where(eq(events.id, id));
    } else {
      await db().insert(events).values(parsed.data);
    }
  } catch (err) {
    console.error("[adm] erro ao salvar evento", err);
    return { message: "Não foi possível salvar. Tente novamente em instantes.", ...echo(formData) };
  }

  refreshAgenda();
  redirect(`/adm?mes=${parsed.data.startDate.slice(0, 7)}`);
}

export async function deleteEvent(id: string, month: string) {
  await requireAdmin();
  await db().delete(events).where(eq(events.id, id));
  refreshAgenda();
  redirect(`/adm?mes=${month}`);
}

const isId = (v: string) => /^[0-9a-f-]{36}$/i.test(v);
const isDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v);

/** Salva a alteração de uma única data da série (só o que difere da série; nada diferente = volta ao padrão) */
export async function saveOccurrence(_prev: EventFormState, formData: FormData): Promise<EventFormState> {
  await requireAdmin();

  const eventId = String(formData.get("eventId") ?? "");
  const date = String(formData.get("occurrenceDate") ?? "");
  if (!isId(eventId) || !isDate(date)) return { message: "Data inválida." };
  const parsed = parseOccurrenceForm(formData);
  if ("errors" in parsed) return { errors: parsed.errors, ...echo(formData) };

  try {
    const series = await getEventById(eventId);
    if (!series || !isSeriesDate(series, date)) return { message: "Esta data não pertence ao evento." };

    const diff = <T,>(value: T, base: T) => (value === base ? null : value);
    const overrides = {
      title: diff(parsed.data.title, series.title),
      detail: diff(parsed.data.detail, series.detail),
      location: diff(parsed.data.location, series.location),
      startTime: diff(parsed.data.startTime, series.startTime),
      endTime: diff(parsed.data.endTime, series.endTime),
    };
    const where = and(eq(eventExceptions.eventId, eventId), eq(eventExceptions.date, date));

    if (Object.values(overrides).every((v) => v === null)) {
      await db().delete(eventExceptions).where(where);
    } else {
      await db()
        .insert(eventExceptions)
        .values({ eventId, date, cancelled: false, ...overrides })
        .onConflictDoUpdate({
          target: [eventExceptions.eventId, eventExceptions.date],
          set: { cancelled: false, ...overrides, updatedAt: new Date() },
        });
    }
  } catch (err) {
    console.error("[adm] erro ao salvar data", err);
    return { message: "Não foi possível salvar. Tente novamente em instantes.", ...echo(formData) };
  }

  refreshAgenda();
  redirect(`/adm?mes=${date.slice(0, 7)}`);
}

/** Cancela uma data da série (mantém eventuais alterações, caso ela seja restaurada) */
export async function cancelOccurrence(eventId: string, date: string, month: string) {
  await requireAdmin();
  if (!isId(eventId) || !isDate(date)) return;
  await db()
    .insert(eventExceptions)
    .values({ eventId, date, cancelled: true })
    .onConflictDoUpdate({ target: [eventExceptions.eventId, eventExceptions.date], set: { cancelled: true, updatedAt: new Date() } });
  refreshAgenda();
  redirect(`/adm?mes=${month}`);
}

/** Volta a data ao padrão da série */
export async function restoreOccurrence(eventId: string, date: string, month: string) {
  await requireAdmin();
  if (!isId(eventId) || !isDate(date)) return;
  await db()
    .delete(eventExceptions)
    .where(and(eq(eventExceptions.eventId, eventId), eq(eventExceptions.date, date)));
  refreshAgenda();
  redirect(`/adm?mes=${month}`);
}

/** Liga/desliga a agenda no site inteiro (menu, /agenda, home, sitemap) */
export async function toggleAgenda(formData: FormData) {
  await requireAdmin();
  await setAgendaEnabled(formData.get("enabled") === "true");
  updateTag(SETTINGS_TAG);
  // O menu está em todas as páginas estáticas: refaz todas
  revalidatePath("/", "layout");
  const month = String(formData.get("mes") ?? "");
  redirect(/^\d{4}-\d{2}$/.test(month) ? `/adm?mes=${month}` : "/adm");
}
