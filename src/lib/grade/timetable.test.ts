import assert from "node:assert/strict";
import { test } from "node:test";
import { buildTimetable } from "./timetable";
import type { SchoolClass } from "./types";

const c = (id: string, over: Partial<SchoolClass>): SchoolClass => ({
  id,
  title: id,
  weekdays: [1],
  startTime: "19:00",
  endTime: "20:00",
  biweekly: false,
  active: true,
  ...over,
});

test("grade da imagem: segunda com 3 aulas, terça com uma de 3h", () => {
  const t = buildTimetable([
    c("Canto", {}),
    c("Sapateado", { startTime: "20:00", endTime: "21:00" }),
    c("Jazz", { startTime: "21:00", endTime: "22:00" }),
    c("Técnica", { weekdays: [2], endTime: "22:00" }),
    c("Voz", { weekdays: [4], endTime: "22:00" }),
  ]);
  assert.deepEqual(t.rows, [
    { start: "19:00", end: "20:00" },
    { start: "20:00", end: "21:00" },
    { start: "21:00", end: "22:00" },
  ]);
  // Só os dias com aula, de segunda a domingo (sem quarta)
  assert.deepEqual(t.columns.map((col) => col.weekday), [1, 2, 4]);
  const tecnica = t.blocks.find((b) => b.classId === "Técnica")!;
  assert.deepEqual([tecnica.row, tecnica.span, tecnica.lane], [0, 3, 0]);
  const jazz = t.blocks.find((b) => b.classId === "Jazz")!;
  assert.deepEqual([jazz.row, jazz.span], [2, 1]);
});

test("sobreposição no mesmo dia vira duas colunas", () => {
  const t = buildTimetable([c("A", { endTime: "22:00" }), c("B", { startTime: "20:00", endTime: "21:00" })]);
  assert.equal(t.columns[0].lanes, 2);
  const b = t.blocks.find((x) => x.classId === "B")!;
  assert.deepEqual([b.lane, b.row, b.span], [1, 1, 1]);
});

test("buracos sem aula somem das linhas", () => {
  const t = buildTimetable([c("Manhã", { startTime: "10:00", endTime: "11:00" }), c("Noite", {})]);
  assert.deepEqual(t.rows, [
    { start: "10:00", end: "11:00" },
    { start: "19:00", end: "20:00" },
  ]);
  assert.equal(t.blocks.find((b) => b.classId === "Noite")!.row, 1);
});

test("uma aula em vários dias vira um bloco por dia, domingo por último", () => {
  const t = buildTimetable([c("Canto", { weekdays: [0, 1, 3], biweekly: true })]);
  assert.deepEqual(t.columns.map((col) => col.weekday), [1, 3, 0]);
  assert.equal(t.blocks.length, 3);
  assert.ok(t.blocks.every((b) => b.biweekly));
});

test("sem aulas, grade vazia", () => {
  assert.deepEqual(buildTimetable([]), { columns: [], rows: [], blocks: [] });
});
