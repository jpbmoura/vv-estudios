import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/Button";
import { categoryLabel } from "@/content/agenda";
import { dayKey, formatTime, formatWeekday, zonedParts } from "@/lib/agenda/dates";
import type { AgendaEvent } from "@/lib/agenda/queries";
import { EventDetail } from "./EventDetail";

/** Eventos do mês agrupados por dia; os que já passaram ficam esmaecidos e o próximo ganha destaque. */
export function EventList({ events, now }: { events: AgendaEvent[]; now: Date }) {
  const days = new Map<string, AgendaEvent[]>();
  for (const e of events) {
    const key = dayKey(new Date(e.startsAt));
    days.set(key, [...(days.get(key) ?? []), e]);
  }
  const nextId = events.find((e) => new Date(e.startsAt) >= now)?.id;

  return (
    <ol className="divide-y divide-line border-b border-line">
      {[...days.values()].map((dayEvents) => {
        const first = new Date(dayEvents[0].startsAt);
        const dayPast = dayEvents.every((e) => new Date(e.startsAt) < now);
        return (
          <FadeIn as="li" key={dayKey(first)} y={16} className="grid gap-6 py-10 md:grid-cols-12 md:gap-10 md:py-14">
            <div className={`flex items-baseline gap-4 md:col-span-3 md:block ${dayPast ? "opacity-45" : ""}`}>
              <span className="block font-display text-6xl leading-none text-bone md:text-7xl">
                {String(zonedParts(first).day).padStart(2, "0")}
              </span>
              <span className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-gold-light md:mt-4 md:block">
                {formatWeekday(first)}
              </span>
            </div>

            <ul className="space-y-10 md:col-span-9">
              {dayEvents.map((e) => {
                const date = new Date(e.startsAt);
                const past = date < now;
                const isNext = e.id === nextId;
                return (
                  <li key={e.id} className={`relative ${past ? "opacity-45" : ""}`}>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em]">
                      <span className="text-bone">{formatTime(date)}</span>
                      <span aria-hidden className="size-1 rounded-full bg-gold" />
                      <span className="text-gold-light">{categoryLabel(e.category)}</span>
                      {isNext && <span className="border border-gold/60 px-2.5 py-1 text-[0.6rem] text-gold-light">Próximo</span>}
                      {past && <span className="text-mute">Já aconteceu</span>}
                    </div>
                    <h3 className="mt-3 font-display text-[clamp(1.6rem,1.2rem+1.4vw,2.6rem)] leading-tight">{e.title}</h3>
                    {e.location && <p className="mt-2 text-mute">{e.location}</p>}
                    {e.detail && <EventDetail text={e.detail} />}
                    {e.link && !past && (
                      <div className="mt-6">
                        <Button href={e.link} variant="text">
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
