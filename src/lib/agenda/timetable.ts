import { weekdayOf } from "./dates";
import type { AgendaEvent, Occurrence } from "./types";

export type TimetableBlock = {
  key: string;
  eventId: string;
  weekday: number;
  /** Coluna dentro do dia, quando há horários sobrepostos */
  lane: number;
  /** Primeira linha (índice em rows) e quantas linhas ocupa */
  row: number;
  span: number;
  title: string;
  category: string;
  location: string | null;
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

const isGridFreq = (s: { freq: string }) => s.freq === "daily" || s.freq === "weekly";

/**
 * Separa o mês entre a grade semanal (séries diárias/semanais/quinzenais) e a lista
 * "Também neste mês": eventos únicos, mensais e as datas canceladas ou alteradas das séries da grade.
 */
export function splitMonth(series: AgendaEvent[], occurrences: Occurrence[]) {
  const active = new Set(occurrences.filter((o) => !o.cancelled).map((o) => o.eventId));
  const grid = series.filter((s) => isGridFreq(s) && active.has(s.id));
  const gridIds = new Set(grid.map((s) => s.id));
  const also = occurrences.filter((o) => !gridIds.has(o.eventId) || o.cancelled || o.modified);
  return { grid, also };
}

/** Ordem de segunda a domingo */
const weekOrder = (weekday: number) => (weekday + 6) % 7;

/**
 * Monta a grade horária: as linhas são os intervalos entre todos os horários de início/fim
 * (sem os buracos que nenhuma aula cobre), e cada aula ocupa as linhas do seu horário.
 */
export function buildTimetable(grid: AgendaEvent[], occurrences: Occurrence[]): Timetable {
  type Raw = Omit<TimetableBlock, "lane" | "row" | "span">;
  const raw: Raw[] = [];

  for (const s of grid) {
    // Um bloco por dia da semana em que a série realmente acontece no mês
    const weekdays = new Set(occurrences.filter((o) => o.eventId === s.id && !o.cancelled).map((o) => weekdayOf(o.date)));
    for (const weekday of weekdays) {
      raw.push({
        key: `${s.id}:${weekday}`,
        eventId: s.id,
        weekday,
        title: s.title,
        category: s.category,
        location: s.location,
        startTime: s.startTime,
        endTime: s.endTime,
        biweekly: s.freq === "weekly" && s.repeatEvery === 2,
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
