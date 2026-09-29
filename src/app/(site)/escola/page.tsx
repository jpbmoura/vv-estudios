import type { Metadata } from "next";
import { MonthNav } from "@/components/agenda/MonthNav";
import { AlsoThisMonth } from "@/components/escola/AlsoThisMonth";
import { ClassList } from "@/components/escola/ClassList";
import { WeeklyTimetable } from "@/components/escola/WeeklyTimetable";
import { FadeIn } from "@/components/motion/FadeIn";
import { RevealImage } from "@/components/motion/RevealImage";
import { RevealText } from "@/components/motion/RevealText";
import { CtaBand } from "@/components/ui/CtaBand";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHero } from "@/components/ui/PageHero";
import { Rich } from "@/components/ui/Rich";
import { escola } from "@/content/escola";
import { currentMonth, formatMonthName, parseMonth, shiftMonth, type YearMonth } from "@/lib/agenda/dates";
import { getMonthAgenda } from "@/lib/agenda/queries";
import { buildTimetable, splitMonth } from "@/lib/agenda/timetable";
import { getAgendaEnabled } from "@/lib/settings";

export const metadata: Metadata = {
  title: escola.title,
  description: escola.intro[0],
};

/** Grade do mês a partir da agenda; null quando a agenda está desligada, vazia ou fora do ar */
async function loadGrade(month: YearMonth) {
  if (!(await getAgendaEnabled())) return null;
  try {
    const { series, occurrences } = await getMonthAgenda(month);
    const { grid, also } = splitMonth(series, occurrences);
    const timetable = buildTimetable(grid, occurrences);
    if (timetable.blocks.length === 0 && also.every((o) => o.cancelled)) return null;
    return { timetable, also };
  } catch (err) {
    console.error("[escola] erro ao carregar a grade", err);
    return null;
  }
}

export default async function EscolaPage({ searchParams }: PageProps<"/escola">) {
  const { mes } = await searchParams;
  const current = currentMonth();
  const next = shiftMonth(current, 1);
  // Só o mês atual e o próximo
  const month = parseMonth(mes) === next ? next : current;
  const grade = await loadGrade(month);

  return (
    <>
      <PageHero eyebrow="Formação de atores" title={escola.title}>
        <p>
          <Rich text={escola.intro[0]} />
        </p>
      </PageHero>

      <div className="container-page">
        <RevealImage
          src="/images/escola.jpg"
          alt="Alunos sentados em roda num palco escuro, com roteiros nas mãos, ouvindo o professor"
          sizes="100vw"
          priority
          parallax={8}
          className="aspect-[4/3] md:aspect-[21/9]"
        />
      </div>

      <section className="container-page grid gap-10 py-24 md:grid-cols-12 md:py-36">
        <FadeIn className="md:col-span-7 md:col-start-5">
          <p className="font-display text-[clamp(1.5rem,1.2rem+1.1vw,2.2rem)] leading-snug">
            <Rich text={escola.intro[1]} />
          </p>
        </FadeIn>
      </section>

      <section className="container-page pb-28 md:pb-40">
        <FadeIn>
          <Eyebrow>Sete caminhos</Eyebrow>
        </FadeIn>
        <RevealText text={escola.offerTitle} className="mt-8 mb-16 max-w-3xl font-display text-title md:mb-24" />
        <ClassList items={escola.classes} />
        <p className="mt-6 border-t border-line pt-6 text-sm text-mute md:ml-[calc(33.333%+1.33rem)]">{escola.footnote}</p>
      </section>

      {grade && (
        <section id="grade" className="container-page scroll-mt-24 pb-28 md:pb-40">
          <FadeIn>
            <Eyebrow>{escola.grade.eyebrow}</Eyebrow>
          </FadeIn>
          <h2 className="mt-8 mb-12 max-w-3xl font-display text-title md:mb-16">
            {escola.grade.title} <span className="italic text-gold-light">{formatMonthName(month)}</span>
          </h2>

          <div className="mb-12 md:mb-16">
            <MonthNav month={month} current={current} basePath="/escola" min={current} max={next} hash="grade" />
          </div>

          {grade.timetable.blocks.length > 0 && (
            <FadeIn>
              <WeeklyTimetable timetable={grade.timetable} />
            </FadeIn>
          )}
          {grade.also.length > 0 && <AlsoThisMonth occurrences={grade.also} />}
          <p className="mt-8 text-sm text-mute">{escola.grade.note}</p>
        </section>
      )}

      <CtaBand title="Encontre a modalidade que combina com a sua rotina." />
    </>
  );
}
