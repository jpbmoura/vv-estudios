import type { Metadata } from "next";
import { FadeIn } from "@/components/motion/FadeIn";
import { RevealImage } from "@/components/motion/RevealImage";
import { RevealText } from "@/components/motion/RevealText";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHero } from "@/components/ui/PageHero";
import { Paragraphs } from "@/components/ui/Rich";
import { professores } from "@/content/professores";

export const metadata: Metadata = {
  title: professores.title,
  description: professores.intro,
};

export default function ProfessoresPage() {
  return (
    <>
      <PageHero eyebrow="Equipe" title={professores.title}>
        <p>{professores.intro}</p>
      </PageHero>

      <div className="container-page pb-16 md:pb-24">
        {professores.people.map((person, i) => {
          const flip = i % 2 === 1;
          return (
            <article key={person.name} className="grid gap-10 border-t border-line py-20 md:grid-cols-12 md:gap-16 md:py-28">
              <div className={`md:col-span-5 ${flip ? "md:order-2 md:col-start-8" : ""}`}>
                <div className="md:sticky md:top-28">
                  <RevealImage
                    src={person.image}
                    alt={person.alt}
                    sizes="(min-width: 768px) 40vw, 100vw"
                    position="50% 20%"
                    priority={i === 0}
                    className="aspect-[4/5]"
                  />
                </div>
              </div>
              <div className={`md:col-span-6 ${flip ? "md:order-1 md:col-start-1" : "md:col-start-7"}`}>
                <FadeIn>
                  <span className="font-display text-lg italic text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-4 text-[0.7rem] font-medium uppercase tracking-[0.28em] text-gold-light">{person.role}</p>
                </FadeIn>
                <RevealText as="h2" text={person.name} className="mt-4 font-display text-title" />
                <FadeIn delay={0.15} className="mt-10">
                  <Paragraphs items={person.bio} className="text-lg leading-relaxed text-bone/80" />
                </FadeIn>
              </div>
            </article>
          );
        })}
      </div>

      <CtaBand title="Aprenda com quem está em cena." />
    </>
  );
}
