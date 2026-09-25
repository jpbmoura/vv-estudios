"use server";

import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { events } from "@/db/schema";
import { checkPassword, createSession, destroySession, requireAdmin } from "@/lib/auth";
import { monthOf } from "@/lib/agenda/dates";
import { EVENTS_TAG } from "@/lib/agenda/queries";
import { parseEventForm, type FieldErrors } from "@/lib/agenda/validation";
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

function echo(formData: FormData) {
  const values: Record<string, string> = {};
  for (const key of ["title", "detail", "date", "time", "location", "category", "link"]) values[key] = String(formData.get(key) ?? "");
  return { values, attempt: Date.now() };
}

/** Site público e home leem do cache: invalida tudo que mostra eventos */
function refreshAgenda() {
  updateTag(EVENTS_TAG);
  revalidatePath("/agenda");
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
  redirect(`/adm?mes=${monthOf(parsed.data.startsAt)}`);
}

export async function deleteEvent(id: string, month: string) {
  await requireAdmin();
  await db().delete(events).where(eq(events.id, id));
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
