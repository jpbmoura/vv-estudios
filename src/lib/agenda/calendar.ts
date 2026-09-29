import { addDays, monthBounds, weekdayOf, type DateKey, type YearMonth } from "./dates";

/** Semanas do mês (domingo a sábado), incluindo os dias dos meses vizinhos que completam a primeira e a última */
export function monthWeeks(ym: YearMonth): { date: DateKey; inMonth: boolean }[][] {
  const { first, last } = monthBounds(ym);
  const weeks: { date: DateKey; inMonth: boolean }[][] = [];
  for (let d = addDays(first, -weekdayOf(first)); d <= last; ) {
    const week = [];
    for (let i = 0; i < 7; i++, d = addDays(d, 1)) week.push({ date: d, inMonth: d.startsWith(ym) });
    weeks.push(week);
  }
  return weeks;
}
