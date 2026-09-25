import type { Metadata } from "next";
import { FadeIn } from "@/components/motion/FadeIn";
import { RevealImage } from "@/components/motion/RevealImage";
import { RevealText } from "@/components/motion/RevealText";
import { Button } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHero } from "@/components/ui/PageHero";
import { Paragraphs } from "@/components/ui/Rich";
import { convidados } from "@/content/convidados";
import { whatsappLink } from "@/content/site";

export const metadata: Metadata = {
  title: convidados.title,
  description: convidados.intro[0],
};

export default function ConvidadosPage() {
  const [first, ...rest] = convidados.intro;

  return (
    <>
      <PageHero eyebrow="Encontros especiais" title={convidados.title}>
        <p>{first}</p>
      </PageHero>

      <section className="container-page grid gap-10 pb-24 md:grid-cols-12 md:pb-36">
        <FadeIn hero delay={0.6} className="md:col-span-7 md:col-start-5">
          <Paragraphs items={rest} className="text-lg leading-relaxed text-bone/80" />
        </FadeIn>
      </section>

      {convidados.guests.map((guest) => (
        <section key={guest.name} className="border-t border-line bg-ink-2">
          <div className="container-page py-24 md:py-36">
            <FadeIn>
              <Eyebrow>Convidada de {guest.month.replace("/", " · ")}</Eyebrow>
            </FadeIn>
            <RevealText as="h2" text={guest.name} className="mt-8 font-display text-display" />

            <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-12 md:gap-16">
              <div className="md:col-span-5">
                <div className="space-y-8 md:sticky md:top-28">
                  <RevealImage
                    src={guest.image}
                    alt={guest.alt}
                    sizes="(min-width: 768px) 40vw, 100vw"
                    position="50% 25%"
                    className="aspect-[4/5]"
                  />
                  <FadeIn className="border border-gold/40 p-6 md:p-8">
                    <dl className="divide-y divide-line">
                      {guest.prices.map((p) => (
                        <div key={p.label} className="flex items-baseline justify-between gap-4 py-4 first:pt-0">
                          <dt className="text-sm text-mute">{p.label}</dt>
                          <dd className="font-display text-2xl text-bone">{p.value}</dd>
                        </div>
                      ))}
                      <div className="flex items-baseline justify-between gap-4 py-4">
                        <dt className="text-sm text-mute">Data</dt>
                        <dd className="font-display text-xl italic text-gold-light">{guest.date}</dd>
                      </div>
                    </dl>
                    <Button
                      href={whatsappLink(`Olá! Tenho interesse nos encontros com ${guest.name} (${guest.month}).`)}
                      className="mt-4 w-full justify-center"
                    >
                      Quero participar
                    </Button>
                  </FadeIn>
                </div>
              </div>

              <div className="md:col-span-6 md:col-start-7">
                <FadeIn>
                  <h3 className="text-[0.7rem] font-medium uppercase tracking-[0.28em] text-gold-light">A programação</h3>
                  <Paragraphs items={guest.program} className="mt-6 text-lg leading-relaxed text-bone/85" />
                </FadeIn>
                <FadeIn className="mt-16 border-t border-line pt-16">
                  <h3 className="text-[0.7rem] font-medium uppercase tracking-[0.28em] text-gold-light">Quem é {guest.name}</h3>
                  <Paragraphs items={guest.bio} className="mt-6 text-lg leading-relaxed text-bone/80" />
                </FadeIn>
              </div>
            </div>
          </div>
        </section>
      ))}

      <CtaBand />
    </>
  );
}
