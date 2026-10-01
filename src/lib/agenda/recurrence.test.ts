import assert from "node:assert/strict";
import { test } from "node:test";
import { monthWeeks } from "./calendar";
import { zonedToUtc } from "./dates";
import { describeRecurrence, expandOccurrences, isSeriesDate, monthlyOptions } from "./recurrence";
import type { AgendaEvent, AgendaException } from "./types";

const base: AgendaEvent = {
  id: "s1",
  title: "Técnica",
  detail: "",
  location: null,
  category: "aula",
  link: null,
  startDate: "2026-10-07",
  startTime: "19:00",
  endTime: "22:00",
  freq: "none",
  repeatEvery: 1,
  weekdays: [],
  monthlyMode: null,
  untilDate: null,
};
const s = (over: Partial<AgendaEvent>): AgendaEvent => ({ ...base, ...over });
const dates = (series: AgendaEvent[], from: string, to: string, ex: AgendaException[] = []) =>
  expandOccurrences(series, ex, { from, to }).map((o) => o.date);

test("evento único dentro e fora do intervalo", () => {
  assert.deepEqual(dates([s({})], "2026-10-01", "2026-10-31"), ["2026-10-07"]);
  assert.deepEqual(dates([s({})], "2026-11-01", "2026-11-30"), []);
});

test("semanal seg+qua começando no meio da semana", () => {
  // 07/10/2026 é quarta
  const got = dates([s({ freq: "weekly", weekdays: [1, 3] })], "2026-10-01", "2026-10-31");
  assert.deepEqual(got, ["2026-10-07", "2026-10-12", "2026-10-14", "2026-10-19", "2026-10-21", "2026-10-26", "2026-10-28"]);
});

test("quinzenal atravessa a virada do mês", () => {
  // Terças a partir de 06/10: 06, 20/10, 03, 17/11
  const series = s({ startDate: "2026-10-06", freq: "weekly", repeatEvery: 2, weekdays: [2] });
  assert.deepEqual(dates([series], "2026-10-01", "2026-11-30"), ["2026-10-06", "2026-10-20", "2026-11-03", "2026-11-17"]);
});

test("quinzenal com dois dias fica na mesma semana", () => {
  const series = s({ startDate: "2026-10-05", freq: "weekly", repeatEvery: 2, weekdays: [1, 5] });
  assert.deepEqual(dates([series], "2026-10-01", "2026-10-31"), ["2026-10-05", "2026-10-09", "2026-10-19", "2026-10-23"]);
});

test("até é inclusivo", () => {
  const series = s({ freq: "weekly", weekdays: [3], untilDate: "2026-10-21" });
  assert.deepEqual(dates([series], "2026-10-01", "2026-12-31"), ["2026-10-07", "2026-10-14", "2026-10-21"]);
});

test("diário a cada 2 dias", () => {
  const series = s({ freq: "daily", repeatEvery: 2, untilDate: "2026-10-13" });
  assert.deepEqual(dates([series], "2026-10-08", "2026-10-31"), ["2026-10-09", "2026-10-11", "2026-10-13"]);
});

test("mensal dia 31 pula meses curtos", () => {
  const series = s({ startDate: "2026-10-31", freq: "monthly", monthlyMode: "day" });
  assert.deepEqual(dates([series], "2026-10-01", "2027-01-31"), ["2026-10-31", "2026-12-31", "2027-01-31"]);
});

test("mensal 29/02 só em ano bissexto", () => {
  const series = s({ startDate: "2028-01-29", freq: "monthly", monthlyMode: "day" });
  assert.deepEqual(dates([series], "2028-02-01", "2028-02-29"), ["2028-02-29"]);
  assert.deepEqual(dates([series], "2029-02-01", "2029-02-28"), []);
});

test("mensal 2ª terça e última sexta", () => {
  // 13/10/2026 é a 2ª terça de outubro
  const nth = s({ startDate: "2026-10-13", freq: "monthly", monthlyMode: "nth" });
  assert.deepEqual(dates([nth], "2026-10-01", "2026-12-31"), ["2026-10-13", "2026-11-10", "2026-12-08"]);
  // 30/10/2026 é a última sexta de outubro
  const last = s({ startDate: "2026-10-30", freq: "monthly", monthlyMode: "last" });
  assert.deepEqual(dates([last], "2026-10-01", "2026-12-31"), ["2026-10-30", "2026-11-27", "2026-12-25"]);
});

test("exceções: cancelada, alterada e órfã", () => {
  const series = s({ freq: "weekly", weekdays: [3] });
  const ex = (date: string, over: Partial<AgendaException>): AgendaException => ({
    eventId: "s1",
    date,
    cancelled: false,
    title: null,
    detail: null,
    location: null,
    startTime: null,
    endTime: null,
    ...over,
  });
  const occ = expandOccurrences(
    [series],
    [ex("2026-10-14", { cancelled: true }), ex("2026-10-21", { startTime: "20:00", title: "Técnica especial" }), ex("2026-10-15", { cancelled: true })],
    { from: "2026-10-01", to: "2026-10-31" },
  );
  assert.equal(occ.length, 4);
  const byDate = Object.fromEntries(occ.map((o) => [o.date, o]));
  assert.equal(byDate["2026-10-14"].cancelled, true);
  assert.equal(byDate["2026-10-21"].modified, true);
  assert.equal(byDate["2026-10-21"].startTime, "20:00");
  assert.equal(byDate["2026-10-21"].endTime, "22:00");
  assert.equal(byDate["2026-10-21"].title, "Técnica especial");
  assert.equal(byDate["2026-10-07"].modified, false);
  assert.equal(byDate["2026-10-15"], undefined);
});

test("startsAt no fuso de Curitiba", () => {
  const [o] = expandOccurrences([s({})], [], { from: "2026-10-07", to: "2026-10-07" });
  assert.equal(o.startsAt, zonedToUtc("2026-10-07", "19:00").toISOString());
  assert.equal(o.startsAt, "2026-10-07T22:00:00.000Z");
});

test("isSeriesDate", () => {
  const series = s({ freq: "weekly", weekdays: [3] });
  assert.equal(isSeriesDate(series, "2026-10-14"), true);
  assert.equal(isSeriesDate(series, "2026-10-15"), false);
  assert.equal(isSeriesDate(series, "2026-09-30"), false);
});

test("descrições em português", () => {
  assert.equal(describeRecurrence(s({})), "Evento único");
  assert.equal(describeRecurrence(s({ freq: "daily" })), "Todos os dias");
  assert.equal(describeRecurrence(s({ freq: "weekly", weekdays: [3, 1] })), "Toda seg e qua");
  assert.equal(describeRecurrence(s({ freq: "weekly", weekdays: [6] })), "Todo sáb");
  assert.equal(describeRecurrence(s({ freq: "weekly", repeatEvery: 2, weekdays: [2], untilDate: "2026-12-15" })), "Quinzenal · ter · até 15/12");
  assert.equal(describeRecurrence(s({ startDate: "2026-10-13", freq: "monthly", monthlyMode: "nth" })), "Toda 2ª terça");
  assert.equal(describeRecurrence(s({ startDate: "2026-10-10", freq: "monthly", monthlyMode: "nth" })), "Todo 2º sábado");
});

test("opções mensais", () => {
  assert.deepEqual(monthlyOptions("2026-10-13"), { day: "Todo dia 13", nth: "Toda 2ª terça" });
  assert.equal(monthlyOptions("2026-10-30").last, "Toda última sexta");
});

test("semanas do calendário começam no domingo", () => {
  const weeks = monthWeeks("2026-11");
  assert.equal(weeks[0][0].date, "2026-11-01");
  assert.equal(weeks.at(-1)!.at(-1)!.date, "2026-12-05");
  assert.equal(weeks.flat().filter((d) => d.inMonth).length, 30);
});
