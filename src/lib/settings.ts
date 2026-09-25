import "server-only";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { db } from "@/db";
import { settings } from "@/db/schema";

export const SETTINGS_TAG = "settings";
const AGENDA_KEY = "agenda_enabled";

async function readAgendaEnabled() {
  const [row] = await db().select().from(settings).where(eq(settings.key, AGENDA_KEY)).limit(1);
  // Sem registro = nunca foi ligada: a agenda começa oculta
  return row?.value === "true";
}

const cachedAgendaEnabled = unstable_cache(readAgendaEnabled, ["agenda-enabled"], { tags: [SETTINGS_TAG], revalidate: 3600 });

/** Site público: na dúvida (banco fora do ar), esconde a agenda */
export async function getAgendaEnabled() {
  try {
    return await cachedAgendaEnabled();
  } catch (err) {
    console.error("[settings] erro ao ler agenda_enabled", err);
    return false;
  }
}

/** Painel: sempre direto do banco */
export const getAgendaEnabledFresh = readAgendaEnabled;

export async function setAgendaEnabled(enabled: boolean) {
  const value = String(enabled);
  await db()
    .insert(settings)
    .values({ key: AGENDA_KEY, value })
    .onConflictDoUpdate({ target: settings.key, set: { value, updatedAt: new Date() } });
}
