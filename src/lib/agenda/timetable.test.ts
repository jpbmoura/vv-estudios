import assert from "node:assert/strict";
import { test } from "node:test";
import { monthWeeks } from "./calendar";
import { expandOccurrences } from "./recurrence";
import { buildTimetable, splitMonth } from "./timetable";
import type { AgendaEvent } from "./types";

const s = (id: string, over: Partial<AgendaEvent>): AgendaEvent => ({
  id,
  title: id,
  detail: "",
  location: null,
  category: "aula",
  link: null,
  startDate: "2026-11-02",
  startTime: "19:00",
  endTime: "20:00",
  freq: "weekly",
  repeatEvery: 1,
  weekdays: [1],
  monthlyMode: null,
  untilDate: null,
  ...over,
});

const month = { from: "2026-11-01", to: "2026-11-30" };

function build(series: AgendaEvent[]) {
  const occ = expandOccurrences(series, [], month);
  const { grid, also } = splitMonth(series, occ);
  return { ...buildTimetable(grid, occ), also };
}

test("grade da imagem: segunda com 3 aulas, terça com uma de 3h", () => {
  const t = build([
    s("Canto", {}),
    s("Sapateado", { startTime: "20:00", endTime: "21:00" }),
    s("Jazz", { startTime: "21:00", endTime: "22:00" }),
    s("Técnica", { weekdays: [2], endTime: "22:00" }),
    s("Voz", { weekdays: [4], endTime: "22:00" }),
  ]);
  assert.deepEqual(t.rows, [
    { start: "19:00", end: "20:00" },
    { start: "20:00", end: "21:00" },
    { start: "21:00", end: "22:00" },
  ]);
  // Só os dias com aula, de segunda a domingo (sem quarta)
  assert.deepEqual(t.columns.map((c) => c.weekday), [1, 2, 4]);
  const tecnica = t.blocks.find((b) => b.eventId === "Técnica")!;
  assert.deepEqual([tecnica.row, tecnica.span, tecnica.lane], [0, 3, 0]);
  const jazz = t.blocks.find((b) => b.eventId === "Jazz")!;
  assert.deepEqual([jazz.row, jazz.span], [2, 1]);
});

test("sobreposição no mesmo dia vira duas colunas", () => {
  const t = build([s("A", { endTime: "22:00" }), s("B", { startTime: "20:00", endTime: "21:00" })]);
  assert.equal(t.columns[0].lanes, 2);
  const b = t.blocks.find((x) => x.eventId === "B")!;
  assert.deepEqual([b.lane, b.row, b.span], [1, 1, 1]);
});

test("buracos sem aula somem das linhas", () => {
  const t = build([s("Manhã", { startTime: "10:00", endTime: "11:00" }), s("Noite", {})]);
  assert.deepEqual(t.rows, [
    { start: "10:00", end: "11:00" },
    { start: "19:00", end: "20:00" },
  ]);
  assert.equal(t.blocks.find((b) => b.eventId === "Noite")!.row, 1);
});

test("quinzenal marcado e mensais/únicos vão para 'também neste mês'", () => {
  const t = build([
    s("Quinzenal", { repeatEvery: 2, weekdays: [2], startDate: "2026-11-03" }),
    s("Mensal", { freq: "monthly", monthlyMode: "nth", startDate: "2026-11-10" }),
    s("Estreia", { freq: "none", startDate: "2026-11-14" }),
  ]);
  assert.equal(t.blocks.length, 1);
  assert.equal(t.blocks[0].biweekly, true);
  assert.deepEqual(t.also.map((o) => o.eventId), ["Mensal", "Estreia"]);
});

test("exceções de séries da grade aparecem na lista", () => {
  const series = [s("Canto", {})];
  const occ = expandOccurrences(
    series,
    [{ eventId: "Canto", date: "2026-11-09", cancelled: true, title: null, detail: null, location: null, startTime: null, endTime: null }],
    month,
  );
  const { grid, also } = splitMonth(series, occ);
  assert.equal(grid.length, 1);
  assert.deepEqual(also.map((o) => o.date), ["2026-11-09"]);
});

test("semanas do calendário começam no domingo", () => {
  const weeks = monthWeeks("2026-11");
  assert.equal(weeks[0][0].date, "2026-11-01");
  assert.equal(weeks.at(-1)!.at(-1)!.date, "2026-12-05");
  assert.equal(weeks.flat().filter((d) => d.inMonth).length, 30);
});
