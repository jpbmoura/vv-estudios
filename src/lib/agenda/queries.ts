import "server-only";
import { and, asc, eq, gte, lt } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { db } from "@/db";
import { events, type Event } from "@/db/schema";
import { monthRange, type YearMonth } from "./dates";

export const EVENTS_TAG = "events";

/** Evento serializável (vai para client components e para o cache, que guarda JSON) */
export type AgendaEvent = Omit<Event, "startsAt" | "createdAt" | "updatedAt"> & { startsAt: string };

function toAgendaEvent(e: Event): AgendaEvent {
  const { id, title, detail, location, category, link } = e;
  return { id, title, detail, location, category, link, startsAt: e.startsAt.toISOString() };
}

async function queryMonth(ym: YearMonth) {
  const { start, end } = monthRange(ym);
  const rows = await db()
    .select()
    .from(events)
    .where(and(gte(events.startsAt, start), lt(events.startsAt, end)))
    .orderBy(asc(events.startsAt));
  return rows.map(toAgendaEvent);
}

async function queryUpcoming(limit: number) {
  const rows = await db()
    .select()
    .from(events)
    .where(gte(events.startsAt, new Date()))
    .orderBy(asc(events.startsAt))
    .limit(limit);
  return rows.map(toAgendaEvent);
}

// Site público: cacheado e invalidado pelo /adm a cada alteração
export const getEventsByMonth = unstable_cache(queryMonth, ["events-by-month"], { tags: [EVENTS_TAG], revalidate: 3600 });
export const getUpcomingEvents = unstable_cache(queryUpcoming, ["events-upcoming"], { tags: [EVENTS_TAG], revalidate: 600 });

// Painel: sempre direto do banco
export const getEventsByMonthFresh = queryMonth;

export async function getEventById(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const [row] = await db().select().from(events).where(eq(events.id, id)).limit(1);
  return row ? toAgendaEvent(row) : null;
}
