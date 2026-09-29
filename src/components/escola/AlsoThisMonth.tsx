import Link from "next/link";
import { FadeIn } from "@/components/motion/FadeIn";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { categoryLabel, occurrenceLabels, weekdayShort } from "@/content/agenda";
import { escola } from "@/content/escola";
import { timeRange, weekdayOf } from "@/lib/agenda/dates";
import type { Occurrence } from "@/lib/agenda/types";

type Props = {
  occurrences: Occurrence[];
  /** Link de cada data (o /adm usa para abrir a edição) */
  hrefFor?: (o: Occurrence) => string;
};

/** Eventos únicos e mensais do mês, mais as aulas da grade canceladas ou com horário especial */
export function AlsoThisMonth({ occurrences, hrefFor }: Props) {
  return (
    <div className="mt-20 md:mt-28">
      <h3>
        <Eyebrow>{escola.grade.alsoTitle}</Eyebrow>
      </h3>
      <ol className="mt-8 divide-y divide-line border-y border-line">
        {occurrences.map((o, i) => {
          const row = `grid grid-cols-[4.5rem_1fr] items-baseline gap-x-6 gap-y-2 py-6 md:grid-cols-12 md:gap-10 ${o.cancelled ? "opacity-55" : ""}`;
          const content = (
            <>
              <span className="flex items-baseline gap-2 md:col-span-2">
                <span className="font-display text-4xl leading-none text-bone">{o.date.slice(8, 10)}</span>
                <span className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-gold-light">{weekdayShort[weekdayOf(o.date)]}</span>
              </span>
              <span className="md:col-span-7">
                <span className={`block font-display text-2xl leading-snug ${o.cancelled ? "line-through decoration-1" : ""}`}>{o.title}</span>
                <span className="mt-1 block text-sm text-mute">
                  {categoryLabel(o.category)}
                  {o.location && ` · ${o.location}`}
                </span>
              </span>
              <span className="col-start-2 flex flex-wrap items-center gap-3 md:col-span-3 md:col-start-auto md:justify-end">
                <span className={`text-sm text-bone/80 ${o.cancelled ? "line-through" : ""}`}>{timeRange(o.startTime, o.endTime)}</span>
                {o.cancelled && <span className="border border-line px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-mute">{occurrenceLabels.cancelled}</span>}
                {o.modified && <span className="border border-gold/60 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-gold-light">{occurrenceLabels.modified}</span>}
              </span>
            </>
          );
          return (
            <FadeIn as="li" key={o.key} delay={Math.min(i, 6) * 0.05} y={12}>
              {hrefFor ? (
                <Link href={hrefFor(o)} className={`${row} transition-colors duration-500 ease-curtain hover:bg-ink-2`}>
                  {content}
                </Link>
              ) : (
                <div className={row}>{content}</div>
              )}
            </FadeIn>
          );
        })}
      </ol>
    </div>
  );
}
