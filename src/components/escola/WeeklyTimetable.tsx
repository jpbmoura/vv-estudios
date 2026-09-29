import { occurrenceLabels, weekdayNames, weekdayShort } from "@/content/agenda";
import { escola } from "@/content/escola";
import type { Timetable } from "@/lib/agenda/timetable";

const headClass = "text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-gold-light";

function BiweeklyTag() {
  return <span className="mt-3 inline-block border border-gold/60 px-2 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-gold-light">{occurrenceLabels.biweekly}</span>;
}

/**
 * Grade horária do mês: linhas são os horários, colunas os dias da semana que têm aula.
 * Uma aula ocupa todas as linhas do seu horário; aulas sobrepostas no mesmo dia dividem a coluna.
 * As linhas da tabela são o fundo `bg-line` aparecendo pelo `gap-px`.
 */
export function WeeklyTimetable({ timetable }: { timetable: Timetable }) {
  const { columns, rows, blocks } = timetable;

  // Primeira coluna de grade de cada dia (a 1ª é a dos horários)
  const firstCol = new Map<number, number>();
  let col = 2;
  for (const c of columns) {
    firstCol.set(c.weekday, col);
    col += c.lanes;
  }
  const totalLanes = col - 2;

  // Células vazias: todo (linha, coluna) que nenhuma aula cobre precisa de fundo próprio
  const covered = new Set<string>();
  for (const b of blocks) for (let r = b.row; r < b.row + b.span; r++) covered.add(`${r}:${firstCol.get(b.weekday)! + b.lane}`);
  const empty: { row: number; col: number }[] = [];
  rows.forEach((_, r) => {
    for (let c = 2; c < col; c++) if (!covered.has(`${r}:${c}`)) empty.push({ row: r, col: c });
  });

  return (
    <>
      {/* Desktop: tabela */}
      <div
        className="hidden gap-px border border-line bg-line md:grid"
        style={{
          gridTemplateColumns: `minmax(6.5rem, auto) repeat(${totalLanes}, minmax(0, 1fr))`,
          gridTemplateRows: `auto repeat(${rows.length}, minmax(6.5rem, auto))`,
        }}
      >
        <div className={`flex items-center justify-center bg-ink px-4 py-7 ${headClass}`}>{escola.grade.timeHeader}</div>
        {columns.map((c) => (
          <div
            key={c.weekday}
            className={`flex items-center justify-center bg-ink px-4 py-7 ${headClass}`}
            style={{ gridColumn: `${firstCol.get(c.weekday)} / span ${c.lanes}` }}
          >
            <abbr title={weekdayNames[c.weekday]} className="no-underline">
              {weekdayShort[c.weekday]}
            </abbr>
          </div>
        ))}

        {rows.map((r, i) => (
          <div key={r.start} className="flex items-center justify-center bg-ink px-4 text-center font-display text-lg text-bone/80" style={{ gridColumn: 1, gridRow: i + 2 }}>
            {r.start} – {r.end}
          </div>
        ))}

        {empty.map((e) => (
          <div key={`${e.row}:${e.col}`} aria-hidden className="bg-ink" style={{ gridColumn: e.col, gridRow: e.row + 2 }} />
        ))}

        {blocks.map((b) => (
          <div
            key={b.key}
            className="flex min-w-0 flex-col items-center justify-center bg-ink px-3 py-6 text-center transition-colors duration-700 ease-curtain hover:bg-ink-2"
            style={{ gridColumn: firstCol.get(b.weekday)! + b.lane, gridRow: `${b.row + 2} / span ${b.span}` }}
          >
            <span className="max-w-full font-display text-[clamp(0.85rem,0.5rem+0.55vw,1.25rem)] uppercase leading-tight tracking-[0.02em] text-balance break-words text-bone">{b.title}</span>
            {b.biweekly && <BiweeklyTag />}
            <span className="sr-only">
              {weekdayNames[b.weekday]}, {b.startTime} às {b.endTime}
            </span>
          </div>
        ))}
      </div>

      {/* Celular: um bloco por dia, sem rolagem lateral */}
      <ol className="divide-y divide-line border-y border-line md:hidden">
        {columns.map((c) => (
          <li key={c.weekday} className="py-8">
            <h3 className={`${headClass} first-letter:uppercase`}>{weekdayNames[c.weekday]}</h3>
            <ul className="mt-5 space-y-5">
              {blocks
                .filter((b) => b.weekday === c.weekday)
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map((b) => (
                  <li key={b.key} className="grid grid-cols-[6.5rem_1fr] items-baseline gap-4">
                    <span className="text-sm text-mute">
                      {b.startTime} – {b.endTime}
                    </span>
                    <span>
                      <span className="block font-display text-xl uppercase leading-tight tracking-[0.04em] text-bone">{b.title}</span>
                      {b.biweekly && <BiweeklyTag />}
                    </span>
                  </li>
                ))}
            </ul>
          </li>
        ))}
      </ol>
    </>
  );
}
