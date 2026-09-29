import { weekdayNames, weekdayShort } from "@/content/agenda";
import { addDays, daysBetween, daysInMonth, formatDayNumeric, weekdayOf, zonedToUtc, type DateKey, type YearMonth } from "./dates";
import type { AgendaEvent, AgendaException, MonthlyMode, Occurrence } from "./types";

/** Segunda-feira da semana do dia (as semanas da quinzena contam de segunda a domingo) */
function mondayOf(date: DateKey) {
  return addDays(date, -((weekdayOf(date) + 6) % 7));
}

const monthIndex = (date: DateKey) => Number(date.slice(0, 4)) * 12 + Number(date.slice(5, 7)) - 1;
const monthFromIndex = (i: number): YearMonth => `${Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, "0")}`;

/** Qual ocorrência do dia da semana no mês (1ª, 2ª…) */
const nthOf = (date: DateKey) => Math.ceil(Number(date.slice(8, 10)) / 7);

/** Data da ocorrência mensal no mês, ou null se o mês não tem (dia 31, 5ª terça…) */
function monthlyDate(ym: YearMonth, start: DateKey, mode: MonthlyMode): DateKey | null {
  const total = daysInMonth(ym);
  if (mode === "day") {
    const day = Number(start.slice(8, 10));
    return day <= total ? `${ym}-${String(day).padStart(2, "0")}` : null;
  }
  const weekday = weekdayOf(start);
  if (mode === "last") {
    const last = `${ym}-${String(total).padStart(2, "0")}`;
    return addDays(last, -((weekdayOf(last) - weekday + 7) % 7));
  }
  const first = `${ym}-01`;
  const date = addDays(first, (weekday - weekdayOf(first) + 7) % 7 + (nthOf(start) - 1) * 7);
  return date.startsWith(ym) ? date : null;
}

/** Datas da série dentro de [from, to] (sem exceções) */
function seriesDates(s: AgendaEvent, from: DateKey, to: DateKey): DateKey[] {
  const lo = s.startDate > from ? s.startDate : from;
  const hi = s.untilDate && s.untilDate < to ? s.untilDate : to;
  if (lo > hi) return [];
  const every = Math.max(1, s.repeatEvery);
  const out: DateKey[] = [];

  switch (s.freq) {
    case "none":
      if (s.startDate >= from && s.startDate <= to) out.push(s.startDate);
      break;
    case "daily":
      for (let d = lo; d <= hi; d = addDays(d, 1)) if (daysBetween(s.startDate, d) % every === 0) out.push(d);
      break;
    case "weekly": {
      const days = s.weekdays.length ? s.weekdays : [weekdayOf(s.startDate)];
      const week0 = mondayOf(s.startDate);
      for (let d = lo; d <= hi; d = addDays(d, 1)) {
        if (!days.includes(weekdayOf(d))) continue;
        if ((daysBetween(week0, mondayOf(d)) / 7) % every === 0) out.push(d);
      }
      break;
    }
    case "monthly": {
      const start = monthIndex(s.startDate);
      for (let i = monthIndex(lo); i <= monthIndex(hi); i++) {
        if ((i - start) % every !== 0) continue;
        const d = monthlyDate(monthFromIndex(i), s.startDate, s.monthlyMode ?? "day");
        if (d && d >= lo && d <= hi) out.push(d);
      }
      break;
    }
  }
  return out;
}

/** Expande as séries em ocorrências concretas de [from, to], aplicando cancelamentos e alterações */
export function expandOccurrences(series: AgendaEvent[], exceptions: AgendaException[], range: { from: DateKey; to: DateKey }): Occurrence[] {
  const byKey = new Map(exceptions.map((x) => [`${x.eventId}:${x.date}`, x]));
  const out: Occurrence[] = [];

  for (const s of series) {
    for (const date of seriesDates(s, range.from, range.to)) {
      const key = `${s.id}:${date}`;
      // Exceção de uma data que não pertence mais à regra (série editada) simplesmente não casa
      const x = byKey.get(key);
      const startTime = x?.startTime ?? s.startTime;
      const endTime = x?.endTime ?? s.endTime;
      out.push({
        key,
        eventId: s.id,
        date,
        startTime,
        endTime,
        startsAt: zonedToUtc(date, startTime).toISOString(),
        endsAt: zonedToUtc(date, endTime).toISOString(),
        title: x?.title ?? s.title,
        detail: x?.detail ?? s.detail,
        location: x?.location ?? s.location,
        category: s.category,
        link: s.link,
        freq: s.freq,
        repeatEvery: s.repeatEvery,
        cancelled: x?.cancelled ?? false,
        modified: !!x && !x.cancelled,
      });
    }
  }

  return out.sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime) || a.title.localeCompare(b.title));
}

/** A data pertence à série? (para validar a rota de ocorrência do /adm) */
export function isSeriesDate(s: AgendaEvent, date: DateKey) {
  return seriesDates(s, date, date).length > 0;
}

// Segunda a sexta são femininas ("toda terça"), sábado e domingo masculinos ("todo sábado")
const masculine = (weekday: number) => weekday === 0 || weekday === 6;

/** Rótulos das opções mensais para a data de início */
export function monthlyOptions(startDate: DateKey): Partial<Record<MonthlyMode, string>> {
  const weekday = weekdayOf(startDate);
  const m = masculine(weekday);
  const day = Number(startDate.slice(8, 10));
  const name = weekdayNames[weekday];
  const options: Partial<Record<MonthlyMode, string>> = {
    day: `Todo dia ${day}`,
    nth: `${m ? "Todo" : "Toda"} ${nthOf(startDate)}${m ? "º" : "ª"} ${name}`,
  };
  // "Última" só faz sentido se a data cai na última semana do mês
  if (day + 7 > daysInMonth(startDate.slice(0, 7) as YearMonth)) options.last = `${m ? "Todo último" : "Toda última"} ${name}`;
  return options;
}

/** Ordem de segunda a domingo */
const byWeekOrder = (a: number, b: number) => ((a + 6) % 7) - ((b + 6) % 7);

/** "Toda seg e qua · até 15/12", "Quinzenal · ter", "Toda 2ª terça", "Evento único" */
export function describeRecurrence(s: AgendaEvent) {
  const every = Math.max(1, s.repeatEvery);
  let text: string;

  switch (s.freq) {
    case "none":
      return "Evento único";
    case "daily":
      text = every === 1 ? "Todos os dias" : `A cada ${every} dias`;
      break;
    case "weekly": {
      const days = [...(s.weekdays.length ? s.weekdays : [weekdayOf(s.startDate)])].sort(byWeekOrder);
      const names = days.map((d) => weekdayShort[d].toLowerCase());
      const list = names.length > 1 ? `${names.slice(0, -1).join(", ")} e ${names.at(-1)}` : names[0];
      text = every === 1 ? `${days.every(masculine) ? "Todo" : "Toda"} ${list}` : every === 2 ? `Quinzenal · ${list}` : `A cada ${every} semanas · ${list}`;
      break;
    }
    case "monthly":
      text = monthlyOptions(s.startDate)[s.monthlyMode ?? "day"] ?? `Todo dia ${Number(s.startDate.slice(8, 10))}`;
      if (every > 1) text += ` · a cada ${every} meses`;
      break;
  }

  return s.untilDate ? `${text} · até ${formatDayNumeric(s.untilDate)}` : text;
}
