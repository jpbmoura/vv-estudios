import type { SchoolClass } from "./types";

export type TimetableBlock = {
  key: string;
  classId: string;
  weekday: number;
  /** Coluna dentro do dia, quando há horários sobrepostos */
  lane: number;
  /** Primeira linha (índice em rows) e quantas linhas ocupa */
  row: number;
  span: number;
  title: string;
  startTime: string;
  endTime: string;
  biweekly: boolean;
};

export type Timetable = {
  /** Dias com alguma aula, de segunda a domingo */
  columns: { weekday: number; lanes: number }[];
  rows: { start: string; end: string }[];
  blocks: TimetableBlock[];
};

/** Ordem de segunda a domingo */
const weekOrder = (weekday: number) => (weekday + 6) % 7;

/**
 * Monta a grade horária: as linhas são os intervalos entre todos os horários de início/fim
 * (sem os buracos que nenhuma aula cobre), e cada aula ocupa as linhas do seu horário.
 */
export function buildTimetable(classes: SchoolClass[]): Timetable {
  type Raw = Omit<TimetableBlock, "lane" | "row" | "span">;
  const raw: Raw[] = [];

  // Um bloco por dia da semana da aula
  for (const c of classes) {
    for (const weekday of new Set(c.weekdays)) {
      raw.push({
        key: `${c.id}:${weekday}`,
        classId: c.id,
        weekday,
        title: c.title,
        startTime: c.startTime,
        endTime: c.endTime,
        biweekly: c.biweekly,
      });
    }
  }

  const bounds = [...new Set(raw.flatMap((b) => [b.startTime, b.endTime]))].sort();
  const rows = bounds
    .slice(0, -1)
    .map((start, i) => ({ start, end: bounds[i + 1] }))
    .filter((r) => raw.some((b) => b.startTime <= r.start && b.endTime >= r.end));

  const blocks: TimetableBlock[] = [];
  const columns: Timetable["columns"] = [];
  const weekdays = [...new Set(raw.map((b) => b.weekday))].sort((a, b) => weekOrder(a) - weekOrder(b));

  for (const weekday of weekdays) {
    const day = raw
      .filter((b) => b.weekday === weekday)
      .sort((a, b) => a.startTime.localeCompare(b.startTime) || b.endTime.localeCompare(a.endTime) || a.title.localeCompare(b.title));
    // Cada aula vai para a primeira coluna livre no seu horário
    const laneEnds: string[] = [];
    for (const b of day) {
      let lane = laneEnds.findIndex((end) => end <= b.startTime);
      if (lane === -1) lane = laneEnds.length;
      laneEnds[lane] = b.endTime;
      const row = rows.findIndex((r) => r.start >= b.startTime);
      const span = rows.filter((r) => r.start >= b.startTime && r.end <= b.endTime).length;
      blocks.push({ ...b, lane, row, span });
    }
    columns.push({ weekday, lanes: laneEnds.length });
  }

  return { columns, rows, blocks };
}
