import { RevealText } from "../motion/RevealText";
import { FadeIn } from "../motion/FadeIn";
import { Eyebrow } from "./Eyebrow";

/** Abertura padrão das páginas internas: rótulo, título grande e um texto de apoio opcional. */
export function PageHero({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <section className="container-page pt-40 pb-16 md:pt-52 md:pb-24">
      <FadeIn hero y={12}>
        <Eyebrow>{eyebrow}</Eyebrow>
      </FadeIn>
      <RevealText as="h1" immediate delay={0.15} text={title} className="mt-8 max-w-5xl font-display text-display" />
      {children && (
        <FadeIn hero delay={0.5} className="mt-10 max-w-2xl text-lead text-bone/80">
          {children}
        </FadeIn>
      )}
    </section>
  );
}
