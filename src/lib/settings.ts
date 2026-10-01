import "server-only";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { db } from "@/db";
import { settings } from "@/db/schema";

export const SETTINGS_TAG = "settings";

/** Cada módulo do site tem o seu liga/desliga, independente dos outros */
type FlagKey = "agenda_enabled" | "grade_enabled";

async function readFlag(key: FlagKey) {
  const [row] = await db().select().from(settings).where(eq(settings.key, key)).limit(1);
  // Sem registro = nunca foi ligado: o módulo começa oculto
  return row?.value === "true";
}

// A chave entra nos argumentos, então cada flag tem a sua entrada no cache
const cachedFlag = unstable_cache(readFlag, ["flag"], { tags: [SETTINGS_TAG], revalidate: 3600 });

/** Site público: na dúvida (banco fora do ar), esconde */
async function getFlag(key: FlagKey) {
  try {
    return await cachedFlag(key);
  } catch (err) {
    console.error(`[settings] erro ao ler ${key}`, err);
    return false;
  }
}

async function setFlag(key: FlagKey, enabled: boolean) {
  const value = String(enabled);
  await db()
    .insert(settings)
    .values({ key, value })
    .onConflictDoUpdate({ target: settings.key, set: { value, updatedAt: new Date() } });
}

export const getAgendaEnabled = () => getFlag("agenda_enabled");
/** Painel: sempre direto do banco */
export const getAgendaEnabledFresh = () => readFlag("agenda_enabled");
export const setAgendaEnabled = (enabled: boolean) => setFlag("agenda_enabled", enabled);

export const getGradeEnabled = () => getFlag("grade_enabled");
export const getGradeEnabledFresh = () => readFlag("grade_enabled");
export const setGradeEnabled = (enabled: boolean) => setFlag("grade_enabled", enabled);
