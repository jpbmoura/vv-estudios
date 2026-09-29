import Link from "next/link";
import { FadeIn } from "@/components/motion/FadeIn";
import { RevealText } from "@/components/motion/RevealText";
import { Arrow, Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { agenda, categoryLabel } from "@/content/agenda";
import { formatDay, formatDayWeekday, timeRange } from "@/lib/agenda/dates";
import { getUpcomingOccurrences, type Occurrence } from "@/lib/agenda/queries";
import { getAgendaEnabled } from "@/lib/settings";

/** Os três próximos eventos. Com a agenda desligada, sem eventos ou sem banco, a seção simplesmente não aparece. */
export async function UpcomingEvents() {
  if (!(await getAgendaEnabled())) return null;

  let events: Occurrence[] = [];
  try {
    events = await getUpcomingOccurrences(3);
  } catch (err) {
    console.error("[home] erro ao carregar próximos eventos", err);
  }
  if (events.length === 0) return null;

  return (
    <section className="border-t border-line">
      <div className="container-page py-28 md:py-40">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <FadeIn>
              <Eyebrow>{agenda.upcoming.eyebrow}</Eyebrow>
            </FadeIn>
            <RevealText text={agenda.upcoming.title} className="mt-8 font-display text-title" />
          </div>
          <FadeIn delay={0.2}>
            <Button href="/agenda" variant="outline">
              Ver agenda completa
            </Button>
          </FadeIn>
        </div>

        <ol className="mt-16 grid border-y border-line md:grid-cols-3">
          {events.map((e, i) => (
              <FadeIn as="li" key={e.key} delay={i * 0.12} className="border-line not-first:border-t md:not-first:border-t-0 md:not-first:border-l">
                <Link href={`/agenda?mes=${e.date.slice(0, 7)}`} className="group flex h-full flex-col p-8 transition-colors duration-700 ease-curtain hover:bg-ink-2 md:p-10">
                  <span className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-gold-light">
                    {categoryLabel(e.category)}
                  </span>
                  <span className="mt-8 font-display text-5xl leading-none">{formatDay(e.date)}</span>
                  <span className="mt-3 text-sm text-mute first-letter:uppercase">
                    {formatDayWeekday(e.date)} · {timeRange(e.startTime, e.endTime)}
                  </span>
                  <h3 className="mt-8 font-display text-2xl leading-snug md:text-3xl">{e.title}</h3>
                  {e.location && <p className="mt-2 text-sm text-mute">{e.location}</p>}
                  <span className="mt-auto inline-flex items-center gap-3 pt-10 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-gold-light">
                    Ver na agenda <Arrow />
                  </span>
                </Link>
              </FadeIn>
          ))}
        </ol>
      </div>
    </section>
  );
}
