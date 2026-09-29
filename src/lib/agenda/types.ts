/** Tipos serializáveis da agenda (vão para client components e para o cache, que guarda JSON) */

export type Freq = "none" | "daily" | "weekly" | "monthly";
export type MonthlyMode = "day" | "nth" | "last";

/** Série: um evento único (freq "none") ou uma regra de repetição */
export type AgendaEvent = {
  id: string;
  title: string;
  detail: string;
  location: string | null;
  category: string;
  link: string | null;
  /** Primeira data da série, "2026-09-25" */
  startDate: string;
  /** "19:00" */
  startTime: string;
  endTime: string;
  freq: Freq;
  /** A cada N dias/semanas/meses (quinzenal = weekly + 2) */
  repeatEvery: number;
  /** 0 = domingo … 6 = sábado (só semanal) */
  weekdays: number[];
  monthlyMode: MonthlyMode | null;
  /** Última data possível (inclusiva) */
  untilDate: string | null;
};

/** Alteração de uma data da série: cancelada ou com campos sobrescritos (null = herda) */
export type AgendaException = {
  eventId: string;
  /** Data original da ocorrência */
  date: string;
  cancelled: boolean;
  title: string | null;
  detail: string | null;
  location: string | null;
  startTime: string | null;
  endTime: string | null;
};

/** Uma data concreta de uma série, já com as exceções aplicadas */
export type Occurrence = {
  /** `${eventId}:${date}` */
  key: string;
  eventId: string;
  date: string;
  startTime: string;
  endTime: string;
  /** Instantes ISO (para passado/próximo) */
  startsAt: string;
  endsAt: string;
  title: string;
  detail: string;
  location: string | null;
  category: string;
  link: string | null;
  freq: Freq;
  repeatEvery: number;
  cancelled: boolean;
  modified: boolean;
};
