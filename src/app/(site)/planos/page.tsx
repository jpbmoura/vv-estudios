import type { Metadata } from "next";
import { FadeIn } from "@/components/motion/FadeIn";
import { RevealText } from "@/components/motion/RevealText";
import { CtaBand } from "@/components/ui/CtaBand";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHero } from "@/components/ui/PageHero";
import { PriceCard } from "@/components/ui/PriceCard";
import { Paragraphs } from "@/components/ui/Rich";
import { planos } from "@/content/planos";

export const metadata: Metadata = {
  title: planos.title,
  description: planos.intro,
};

export default function PlanosPage() {
  return (
    <>
      <PageHero eyebrow="Preços de inauguração" title={planos.title}>
        <p>{planos.intro}</p>
      </PageHero>

      <section className="container-page pb-24 md:pb-32">
        <FadeIn hero delay={0.6} className="mb-10 flex items-end justify-between gap-6 border-b border-line pb-6">
          <h2 className="font-display text-3xl md:text-4xl">Planos mensais</h2>
          <p className="hidden text-sm text-mute sm:block">Todas as aulas em grupo têm 3 horas</p>
        </FadeIn>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {planos.monthly.map((plan, i) => (
            <FadeIn key={plan.title} delay={i * 0.08} className="h-full">
              <PriceCard plan={plan} index={i} />
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="container-page pb-28 md:pb-40">
        <FadeIn className="mb-10 border-b border-line pb-6">
          <h2 className="font-display text-3xl md:text-4xl">Mais formas de estar no Estúdio</h2>
        </FadeIn>
        <div className="grid gap-5 md:grid-cols-3">
          {planos.more.map((plan, i) => (
            <FadeIn key={plan.title} delay={i * 0.08} className="h-full">
              <PriceCard plan={plan} index={i + planos.monthly.length} />
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-ink-2">
        <div className="container-page grid gap-12 py-28 md:grid-cols-12 md:gap-16 md:py-40">
          <div className="md:col-span-5">
            <div className="md:sticky md:top-32">
              <FadeIn>
                <Eyebrow>Como funciona</Eyebrow>
              </FadeIn>
              <RevealText text={planos.terms.title} className="mt-8 font-display text-title" />
            </div>
          </div>
          <FadeIn delay={0.15} className="md:col-span-6 md:col-start-7">
            <Paragraphs items={planos.terms.body} className="text-lg leading-relaxed text-bone/80" />
          </FadeIn>
        </div>
      </section>

      <CtaBand eyebrow="Dúvidas?" title="Fale com a gente e encontre o plano certo para você." />
    </>
  );
}
