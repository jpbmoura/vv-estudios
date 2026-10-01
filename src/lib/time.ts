/** Horas de parede "HH:MM", comuns à agenda e à grade */

export const isTime = (v: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(v);

/** O Postgres devolve "19:00:00" */
export const hhmm = (time: string) => time.slice(0, 5);

/** "19:00" → "19h"; "19:30" → "19h30" */
export function formatHour(time: string) {
  const [h, m] = time.split(":");
  return m === "00" ? `${Number(h)}h` : `${Number(h)}h${m}`;
}

/** "19:00" + "22:00" → "19h–22h" */
export function timeRange(start: string, end: string) {
  return `${formatHour(start)}–${formatHour(end)}`;
}

/** Início e término de um form; os erros vão nas chaves time/endTime */
export function checkTimes(time: string, endTime: string, errors: { time?: string; endTime?: string }) {
  if (!isTime(time)) errors.time = "Informe o horário de início.";
  if (!isTime(endTime)) errors.endTime = "Informe o horário de término.";
  else if (isTime(time) && endTime <= time) errors.endTime = "O término deve ser depois do início.";
}
