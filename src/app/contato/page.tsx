import type { Metadata } from "next";
import { FadeIn } from "@/components/motion/FadeIn";
import { RevealImage } from "@/components/motion/RevealImage";
import { Button } from "@/components/ui/Button";
import { ContactList } from "@/components/ui/ContactList";
import { PageHero } from "@/components/ui/PageHero";
import { contato } from "@/content/contato";
import { site, whatsappLink } from "@/content/site";

export const metadata: Metadata = {
  title: contato.title,
  description: contato.intro,
};

export default function ContatoPage() {
  return (
    <>
      <PageHero eyebrow="Fale conosco" title={contato.title}>
        <p>{contato.intro}</p>
      </PageHero>

      <section className="container-page grid gap-12 pb-24 md:grid-cols-12 md:gap-16 md:pb-32">
        <div className="md:col-span-6">
          <FadeIn hero delay={0.6}>
            <ContactList />
          </FadeIn>
          <FadeIn hero delay={0.75} className="mt-12 flex flex-wrap gap-4">
            <Button href={whatsappLink("Olá! Gostaria de agendar uma aula no Vilela Vianna Estúdios.")}>
              Fale conosco no WhatsApp
            </Button>
            <Button href={site.mapsHref} variant="outline">
              Como chegar
            </Button>
          </FadeIn>
        </div>
        <RevealImage
          src="/images/fachada.png"
          alt={contato.facadeAlt}
          sizes="(min-width: 768px) 40vw, 100vw"
          priority
          parallax={5}
          className="aspect-[3/4] md:col-span-5 md:col-start-8"
        />
      </section>

      <section className="container-page pb-28 md:pb-40">
        <FadeIn className="relative aspect-[4/5] overflow-hidden border border-line sm:aspect-[16/9] md:aspect-[21/9]">
          <iframe
            title={`Mapa: ${site.address.street}, ${site.address.city}`}
            src={site.mapsEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0 [filter:invert(0.9)_hue-rotate(180deg)_grayscale(0.7)_contrast(1.15)]"
          />
        </FadeIn>
      </section>
    </>
  );
}
