/**
 * Datas da agenda sempre no fuso de Curitiba. O servidor (Vercel) roda em UTC,
 * então nada aqui pode depender do fuso da máquina.
 */
export const TIME_ZONE = "America/Sao_Paulo";

/** Mês no formato "2026-09" */
export type YearMonth = `${number}-${string}`;

const partsFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** Data/hora de parede em Curitiba de um instante */
export function zonedParts(date: Date) {
  const p = Object.fromEntries(partsFmt.formatToParts(date).map((x) => [x.type, x.value]));
  return { year: +p.year, month: +p.month, day: +p.day, hour: +p.hour, minute: +p.minute };
}

/** "2026-09-25" + "19:30" em Curitiba → instante UTC */
export function zonedToUtc(date: string, time = "00:00") {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  const p = zonedParts(new Date(guess));
  const offset = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute) - guess;
  return new Date(guess - offset);
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Valores para <input type="date"> e <input type="time"> */
export function toInputValues(date: Date) {
  const p = zonedParts(date);
  return { date: `${p.year}-${pad(p.month)}-${pad(p.day)}`, time: `${pad(p.hour)}:${pad(p.minute)}` };
}

export function dayKey(date: Date) {
  return toInputValues(date).date;
}

export function monthOf(date: Date): YearMonth {
  const p = zonedParts(date);
  return `${p.year}-${pad(p.month)}`;
}

export function currentMonth(): YearMonth {
  return monthOf(new Date());
}

export function parseMonth(value: unknown): YearMonth | null {
  if (typeof value !== "string" || !/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) return null;
  return value as YearMonth;
}

export function shiftMonth(ym: YearMonth, delta: number): YearMonth {
  const [y, m] = ym.split("-").map(Number);
  const total = y * 12 + (m - 1) + delta;
  return `${Math.floor(total / 12)}-${pad((total % 12) + 1)}`;
}

/** [início, fim) do mês em Curitiba, como instantes UTC */
export function monthRange(ym: YearMonth) {
  return { start: zonedToUtc(`${ym}-01`), end: zonedToUtc(`${shiftMonth(ym, 1)}-01`) };
}

const monthFmt = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC", month: "long", year: "numeric" });
const monthNameFmt = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC", month: "long" });

function monthDate(ym: YearMonth) {
  const [y, m] = ym.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 15));
}

/** "setembro de 2026" */
export function formatMonth(ym: YearMonth) {
  return monthFmt.format(monthDate(ym));
}

/** "setembro" */
export function formatMonthName(ym: YearMonth) {
  return monthNameFmt.format(monthDate(ym));
}

const weekdayFmt = new Intl.DateTimeFormat("pt-BR", { timeZone: TIME_ZONE, weekday: "long" });
const shortDateFmt = new Intl.DateTimeFormat("pt-BR", { timeZone: TIME_ZONE, day: "numeric", month: "short" });
const timeFmt = new Intl.DateTimeFormat("pt-BR", { timeZone: TIME_ZONE, hour: "2-digit", minute: "2-digit" });

/** "sexta-feira" */
export function formatWeekday(date: Date) {
  return weekdayFmt.format(date);
}

/** "25 de set." */
export function formatShortDate(date: Date) {
  return shortDateFmt.format(date);
}

/** "19:30" */
export function formatTime(date: Date) {
  return timeFmt.format(date);
}
