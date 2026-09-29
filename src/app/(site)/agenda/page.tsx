import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { EventList } from "@/components/agenda/EventList";
import { MonthCalendar } from "@/components/agenda/MonthCalendar";
import { MonthNav } from "@/components/agenda/MonthNav";
import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHero } from "@/components/ui/PageHero";
import { agenda } from "@/content/agenda";
import { whatsappLink } from "@/content/site";
import { currentMonth, formatMonthName, parseMonth, shiftMonth } from "@/lib/agenda/dates";
import { getMonthAgenda, type Occurrence } from "@/lib/agenda/queries";
import { getAgendaEnabled } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Agenda",
  description: "Espetáculos, estreias, aulas e oficinas do Vilela Vianna Estúdios, mês a mês.",
  alternates: { canonical: "/agenda" },
};

export default async function AgendaPage({ searchParams }: PageProps<"/agenda">) {
  // searchParams antes do redirect: mantém a página dinâmica. Senão, com a agenda desligada no
  // build, o Next congela /agenda como um redirect estático e quebra quando ela é ligada.
  const { mes } = await searchParams;

  // Desligada no /adm: some do site (redirect temporário, ela pode voltar)
  if (!(await getAgendaEnabled())) redirect("/");

  const current = currentMonth();
  const max = shiftMonth(current, 1);
  const asked = parseMonth(mes);
  // Passado livre; futuro só até o próximo mês
  const month = asked && asked <= max ? asked : current;

  let occurrences: Occurrence[] = [];
  let failed = false;
  try {
    ({ occurrences } = await getMonthAgenda(month));
  } catch (err) {
    console.error("[agenda] erro ao carregar eventos", err);
    failed = true;
  }

  const [year] = month.split("-");

  return (
    <>
      <PageHero eyebrow={agenda.eyebrow} title={agenda.title}>
        <p>{agenda.lead}</p>
      </PageHero>

      <section className="container-page pb-28 md:pb-40">
        <FadeIn hero delay={0.6} className="mb-10 flex items-end justify-between gap-6">
          <h2 className="font-display text-title">
            <span className="italic text-gold-light capitalize">{formatMonthName(month)}</span>{" "}
            <span className="text-bone/40">{year}</span>
          </h2>
          {month === current && (
            <span className="hidden pb-3 text-[0.66rem] font-medium uppercase tracking-[0.28em] text-mute sm:block">Este mês</span>
          )}
        </FadeIn>

        <MonthNav month={month} current={current} basePath="/agenda" max={max} />

        {occurrences.some((o) => !o.cancelled) ? (
          <>
            <FadeIn className="hidden md:block">
              <MonthCalendar month={month} occurrences={occurrences} />
            </FadeIn>
            <EventList occurrences={occurrences} now={new Date()} className="md:hidden" />
          </>
        ) : (
          <div className="flex flex-col items-center border-b border-line py-24 text-center md:py-32">
            <p className="font-display text-3xl italic text-bone/90 md:text-4xl">
              {failed ? "Não foi possível carregar a agenda agora." : agenda.empty.title}
            </p>
            <p className="mt-6 max-w-md text-mute">{failed ? "Tente novamente em alguns instantes." : agenda.empty.body}</p>
            {!failed && (
              <div className="mt-10">
                <Button href={whatsappLink("Olá! Gostaria de saber da programação do Vilela Vianna Estúdios.")} variant="outline">
                  Fale com a gente
                </Button>
              </div>
            )}
          </div>
        )}
      </section>

      <CtaBand />
    </>
  );
}
