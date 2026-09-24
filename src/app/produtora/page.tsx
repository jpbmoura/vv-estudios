import type { Metadata } from "next";
import { FadeIn } from "@/components/motion/FadeIn";
import { RevealImage } from "@/components/motion/RevealImage";
import { RevealText } from "@/components/motion/RevealText";
import { Button } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHero } from "@/components/ui/PageHero";
import { Paragraphs } from "@/components/ui/Rich";
import { produtora } from "@/content/produtora";
import { mailtoLink } from "@/content/site";

export const metadata: Metadata = {
  title: produtora.title,
  description: produtora.intro[0],
};

export default function ProdutoraPage() {
  const [first, ...rest] = produtora.intro;

  return (
    <>
      <PageHero eyebrow="Produção teatral" title={produtora.title}>
        <p>{first}</p>
      </PageHero>

      <section className="container-page grid items-start gap-12 pb-24 md:grid-cols-12 md:gap-16 md:pb-36">
        <RevealImage
          src="/images/produtora-1.jpg"
          alt="Ator de fraque em silhueta nos bastidores, iluminado por um refletor, com um candelabro aceso ao fundo"
          sizes="(min-width: 768px) 60vw, 100vw"
          priority
          parallax={6}
          className="aspect-[4/3] md:col-span-7"
        />
        <FadeIn className="md:col-span-5 md:pt-8">
          <Paragraphs items={rest} className="text-lg leading-relaxed text-bone/80" />
        </FadeIn>
      </section>

      {/* Sua marca no teatro */}
      <section className="container-page grid items-center gap-12 border-t border-line py-28 md:grid-cols-12 md:gap-16 md:py-40">
        <div className="order-2 md:order-1 md:col-span-5">
          <FadeIn>
            <Eyebrow>Patrocínio e parcerias</Eyebrow>
          </FadeIn>
          <RevealText text={produtora.brand.title} className="mt-8 font-display text-title" />
          <FadeIn delay={0.2} className="mt-10">
            <Paragraphs items={produtora.brand.body} className="text-lg leading-relaxed text-bone/80" />
          </FadeIn>
          <FadeIn delay={0.3} className="mt-10">
            <Button href={mailtoLink("Parceria com o Vilela Vianna Estúdios")}>{produtora.brand.cta}</Button>
          </FadeIn>
        </div>
        <RevealImage
          src="/images/produtora-2.jpg"
          alt="Casal em figurino de época de mãos dadas no palco, entre candelabros acesos"
          sizes="(min-width: 768px) 55vw, 100vw"
          parallax={6}
          className="order-1 aspect-[4/3] md:order-2 md:col-span-7"
        />
      </section>

      {/* Novos talentos */}
      <section className="container-page pb-28 md:pb-40">
        <div className="relative overflow-hidden border border-line bg-ink-2 px-6 py-16 md:px-16 md:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-40 -top-40 size-[36rem] rounded-full bg-[radial-gradient(circle,rgb(184_134_47/0.14),transparent_65%)]"
          />
          <div className="relative grid gap-12 md:grid-cols-12">
            <div className="md:col-span-6">
              <FadeIn>
                <Eyebrow>Novos talentos</Eyebrow>
              </FadeIn>
              <RevealText text={produtora.talents.title} className="mt-8 font-display text-[clamp(1.9rem,1.4rem+1.9vw,3.2rem)] leading-[1.12]" />
            </div>
            <FadeIn delay={0.2} className="md:col-span-5 md:col-start-8">
              <Paragraphs items={produtora.talents.body} className="text-lg leading-relaxed text-bone/80" />
              <div className="mt-10">
                <Button href={mailtoLink("Portfólio para o Vilela Vianna Estúdios")} variant="outline">
                  {produtora.talents.cta}
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <CtaBand eyebrow="Na escola" title="Quer estar no palco? Comece pelas nossas aulas." />
    </>
  );
}
