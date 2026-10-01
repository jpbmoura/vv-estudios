import "server-only";
import { asc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { db } from "@/db";
import { schoolClasses, type SchoolClassRow } from "@/db/schema";
import { hhmm } from "@/lib/time";
import type { SchoolClass } from "./types";

export type { SchoolClass } from "./types";

export const CLASSES_TAG = "school-classes";

function toSchoolClass(c: SchoolClassRow): SchoolClass {
  return {
    id: c.id,
    title: c.title,
    weekdays: c.weekdays,
    startTime: hhmm(c.startTime),
    endTime: hhmm(c.endTime),
    biweekly: c.biweekly,
    active: c.active,
  };
}

async function queryClasses() {
  const rows = await db().select().from(schoolClasses).orderBy(asc(schoolClasses.startTime), asc(schoolClasses.title));
  return rows.map(toSchoolClass);
}

// Site público: cacheado e invalidado pelo /adm a cada alteração
const getClasses = unstable_cache(queryClasses, ["school-classes"], { tags: [CLASSES_TAG], revalidate: 3600 });

/** Só as aulas no ar */
export async function getActiveClasses() {
  return (await getClasses()).filter((c) => c.active);
}

// Painel: sempre direto do banco, pausadas incluídas
export const getAllClassesFresh = queryClasses;

export async function getClassById(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const [row] = await db().select().from(schoolClasses).where(eq(schoolClasses.id, id)).limit(1);
  return row ? toSchoolClass(row) : null;
}
