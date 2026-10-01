import "server-only";
import { and, asc, eq, gte, inArray, isNull, lte, ne, or } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { db } from "@/db";
import { eventExceptions, events, type Event, type EventException } from "@/db/schema";
import { addDays, monthBounds, todayKey, type DateKey, type YearMonth } from "./dates";
import { hhmm } from "@/lib/time";
import { expandOccurrences, isSeriesDate } from "./recurrence";
import type { AgendaEvent, AgendaException, Freq, MonthlyMode, Occurrence } from "./types";

export type { AgendaEvent, AgendaException, Occurrence } from "./types";

export const EVENTS_TAG = "events";

function toAgendaEvent(e: Event): AgendaEvent {
  return {
    id: e.id,
    title: e.title,
    detail: e.detail,
    location: e.location,
    category: e.category,
    link: e.link,
    startDate: e.startDate,
    startTime: hhmm(e.startTime),
    endTime: hhmm(e.endTime),
    freq: e.freq as Freq,
    repeatEvery: e.repeatEvery,
    weekdays: e.weekdays,
    monthlyMode: e.monthlyMode as MonthlyMode | null,
    untilDate: e.untilDate,
  };
}

function toAgendaException(x: EventException): AgendaException {
  return {
    eventId: x.eventId,
    date: x.date,
    cancelled: x.cancelled,
    title: x.title,
    detail: x.detail,
    location: x.location,
    startTime: x.startTime && hhmm(x.startTime),
    endTime: x.endTime && hhmm(x.endTime),
  };
}

export type AgendaRange = { series: AgendaEvent[]; occurrences: Occurrence[] };

/** Séries que podem ter datas em [from, to], já expandidas em ocorrências */
async function queryRange(from: DateKey, to: DateKey): Promise<AgendaRange> {
  const rows = await db()
    .select()
    .from(events)
    .where(
      and(
        lte(events.startDate, to),
        or(isNull(events.untilDate), gte(events.untilDate, from)),
        or(ne(events.freq, "none"), gte(events.startDate, from)),
      ),
    )
    .orderBy(asc(events.startDate), asc(events.startTime));
  const series = rows.map(toAgendaEvent);
  if (series.length === 0) return { series, occurrences: [] };

  const exRows = await db()
    .select()
    .from(eventExceptions)
    .where(
      and(
        inArray(
          eventExceptions.eventId,
          series.map((s) => s.id),
        ),
        gte(eventExceptions.date, from),
        lte(eventExceptions.date, to),
      ),
    );

  return { series, occurrences: expandOccurrences(series, exRows.map(toAgendaException), { from, to }) };
}

function queryMonth(ym: YearMonth) {
  const { first, last } = monthBounds(ym);
  return queryRange(first, last);
}

// Site público: cacheado e invalidado pelo /adm a cada alteração.
// Chaves "v2": o cache sobrevive a deploys e o formato mudou com a recorrência.
export const getMonthAgenda = unstable_cache(queryMonth, ["agenda-month-v2"], { tags: [EVENTS_TAG], revalidate: 3600 });
const getRange = unstable_cache(queryRange, ["agenda-range-v2"], { tags: [EVENTS_TAG], revalidate: 600 });

/** Próximas ocorrências (séries expandidas), sem as canceladas */
export async function getUpcomingOccurrences(limit: number) {
  const today = todayKey();
  const { occurrences } = await getRange(today, addDays(today, 120));
  const now = new Date();
  return occurrences.filter((o) => !o.cancelled && new Date(o.startsAt) >= now).slice(0, limit);
}

// Painel: sempre direto do banco
export const getMonthAgendaFresh = queryMonth;

export async function getEventById(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const [row] = await db().select().from(events).where(eq(events.id, id)).limit(1);
  return row ? toAgendaEvent(row) : null;
}

/** Uma data da série, com a exceção aplicada (null se a data não pertence à série) */
export async function getOccurrence(id: string, date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const series = await getEventById(id);
  if (!series || !isSeriesDate(series, date)) return null;
  const [x] = await db()
    .select()
    .from(eventExceptions)
    .where(and(eq(eventExceptions.eventId, id), eq(eventExceptions.date, date)))
    .limit(1);
  const exception = x ? toAgendaException(x) : null;
  const [occurrence] = expandOccurrences([series], exception ? [exception] : [], { from: date, to: date });
  return { series, exception, occurrence };
}
