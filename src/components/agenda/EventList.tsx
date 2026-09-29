import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/Button";
import { categoryLabel, occurrenceLabels } from "@/content/agenda";
import { formatDayWeekday, timeRange } from "@/lib/agenda/dates";
import type { Occurrence } from "@/lib/agenda/types";
import { EventDetail } from "./EventDetail";

/** Ocorrências do mês agrupadas por dia; as que já passaram ficam esmaecidas e a próxima ganha destaque. */
export function EventList({ occurrences, now, className = "" }: { occurrences: Occurrence[]; now: Date; className?: string }) {
  const days = new Map<string, Occurrence[]>();
  for (const o of occurrences) days.set(o.date, [...(days.get(o.date) ?? []), o]);
  const nextKey = occurrences.find((o) => !o.cancelled && new Date(o.startsAt) >= now)?.key;

  return (
    <ol className={`divide-y divide-line border-b border-line ${className}`}>
      {[...days].map(([date, dayItems]) => {
        const dayPast = dayItems.every((o) => new Date(o.endsAt) < now);
        return (
          <FadeIn as="li" key={date} y={16} className="grid gap-6 py-10 md:grid-cols-12 md:gap-10 md:py-14">
            <div className={`flex items-baseline gap-4 md:col-span-3 md:block ${dayPast ? "opacity-45" : ""}`}>
              <span className="block font-display text-6xl leading-none text-bone md:text-7xl">{date.slice(8, 10)}</span>
              <span className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-gold-light md:mt-4 md:block">{formatDayWeekday(date)}</span>
            </div>

            <ul className="space-y-10 md:col-span-9">
              {dayItems.map((o) => {
                const past = new Date(o.endsAt) < now;
                const isNext = o.key === nextKey;
                return (
                  <li key={o.key} className={`relative ${past || o.cancelled ? "opacity-45" : ""}`}>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em]">
                      <span className={o.cancelled ? "text-bone line-through" : "text-bone"}>{timeRange(o.startTime, o.endTime)}</span>
                      <span aria-hidden className="size-1 rounded-full bg-gold" />
                      <span className="text-gold-light">{categoryLabel(o.category)}</span>
                      {o.cancelled && <span className="border border-line px-2.5 py-1 text-[0.6rem] text-mute">{occurrenceLabels.cancelled}</span>}
                      {o.modified && !past && <span className="border border-gold/60 px-2.5 py-1 text-[0.6rem] text-gold-light">{occurrenceLabels.modified}</span>}
                      {isNext && <span className="border border-gold/60 px-2.5 py-1 text-[0.6rem] text-gold-light">Próximo</span>}
                      {past && !o.cancelled && <span className="text-mute">Já aconteceu</span>}
                    </div>
                    <h3 className={`mt-3 font-display text-[clamp(1.6rem,1.2rem+1.4vw,2.6rem)] leading-tight ${o.cancelled ? "line-through decoration-1" : ""}`}>
                      {o.title}
                    </h3>
                    {o.location && <p className="mt-2 text-mute">{o.location}</p>}
                    {o.detail && !o.cancelled && <EventDetail text={o.detail} />}
                    {o.link && !past && !o.cancelled && (
                      <div className="mt-6">
                        <Button href={o.link} variant="text">
                          Mais informações
                        </Button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </FadeIn>
        );
      })}
    </ol>
  );
}
