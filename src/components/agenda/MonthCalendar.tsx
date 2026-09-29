import Link from "next/link";
import { categoryLabel, occurrenceLabels, weekdayShort } from "@/content/agenda";
import { formatHour, todayKey, type YearMonth } from "@/lib/agenda/dates";
import { monthWeeks } from "@/lib/agenda/calendar";
import type { Occurrence } from "@/lib/agenda/types";

type Props = {
  month: YearMonth;
  occurrences: Occurrence[];
  className?: string;
  /** Link de cada ocorrência (o /adm usa para abrir a edição) */
  hrefFor?: (o: Occurrence) => string;
};

/** Calendário do mês (domingo a sábado) com as ocorrências de cada dia. Só no desktop; no celular a página usa a EventList. */
export function MonthCalendar({ month, occurrences, className = "", hrefFor }: Props) {
  const today = todayKey();
  const byDay = new Map<string, Occurrence[]>();
  for (const o of occurrences) byDay.set(o.date, [...(byDay.get(o.date) ?? []), o]);

  return (
    <div className={className}>
      <div className="grid grid-cols-7 border-b border-line">
        {weekdayShort.map((d) => (
          <span key={d} className="px-3 py-4 text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-gold-light">
            {d}
          </span>
        ))}
      </div>

      <ol className="grid grid-cols-7 border-l border-line">
        {monthWeeks(month)
          .flat()
          .map(({ date, inMonth }) => {
            const items = inMonth ? (byDay.get(date) ?? []) : [];
            const isToday = inMonth && date === today;
            const past = date < today;
            return (
              <li
                key={date}
                aria-hidden={!inMonth || undefined}
                className={`relative min-h-36 border-r border-b border-line p-3 ${inMonth ? "" : "bg-ink-2/50"} ${
                  isToday ? "outline outline-1 -outline-offset-1 outline-gold" : ""
                }`}
              >
                <span
                  className={`font-display text-2xl leading-none ${!inMonth ? "text-bone/15" : past ? "text-bone/40" : isToday ? "italic text-gold-light" : "text-bone"}`}
                >
                  {Number(date.slice(8, 10))}
                </span>
                {items.length > 0 && (
                  <ul className={`mt-3 space-y-2 ${past ? "opacity-45" : ""}`}>
                    {items.map((o) => {
                      const content = (
                        <>
                          <span className={`block font-semibold tracking-[0.08em] ${o.cancelled ? "text-mute line-through" : "text-gold-light"}`}>
                            {formatHour(o.startTime)}
                            {o.cancelled && <span className="sr-only"> ({occurrenceLabels.cancelled})</span>}
                          </span>
                          <span className={`line-clamp-2 ${o.cancelled ? "text-mute line-through" : "text-bone/90"}`}>{o.title}</span>
                        </>
                      );
                      return (
                        <li key={o.key} title={`${o.title} · ${categoryLabel(o.category)}${o.cancelled ? ` · ${occurrenceLabels.cancelled}` : ""}`} className="border-l border-gold/60 text-xs leading-snug">
                          {hrefFor ? (
                            <Link href={hrefFor(o)} className="block py-0.5 pl-2 transition-colors duration-500 ease-curtain hover:bg-ink-3">
                              {content}
                            </Link>
                          ) : (
                            <div className="pl-2">{content}</div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
      </ol>
    </div>
  );
}
