/** Aula da grade escolar, serializável (sem banco) */
export type SchoolClass = {
  id: string;
  title: string;
  /** 0 = domingo … 6 = sábado */
  weekdays: number[];
  /** "19:00" */
  startTime: string;
  endTime: string;
  biweekly: boolean;
  active: boolean;
};
