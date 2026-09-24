import Image from "next/image";
import Link from "next/link";
import { HomeHero } from "@/components/home/HomeHero";
import { FadeIn } from "@/components/motion/FadeIn";
import { RevealImage } from "@/components/motion/RevealImage";
import { RevealText } from "@/components/motion/RevealText";
import { Arrow, Button } from "@/components/ui/Button";
import { ContactList } from "@/components/ui/ContactList";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Rich } from "@/components/ui/Rich";
import { contato } from "@/content/contato";
import { home } from "@/content/home";
import { whatsappLink } from "@/content/site";

export default function HomePage() {
  return (
    <>
      <HomeHero />

      {/* Apresentação */}
      <section className="container-page py-28 text-center md:py-44">
        <FadeIn className="mx-auto mb-12 h-16 w-24 md:h-20 md:w-32" y={10}>
          <div className="relative h-full w-full">
            <Image src="/images/logo.png" alt="" fill sizes="128px" className="object-contain" />
          </div>
        </FadeIn>
        <RevealText text={home.intro.title} className="mx-auto max-w-4xl font-display text-title" />
        <FadeIn delay={0.3}>
          <p className="mx-auto mt-10 max-w-2xl font-display text-lead italic text-gold-light">{home.intro.body}</p>
        </FadeIn>
      </section>

      {/* Escola + produtora */}
      <section className="container-page grid items-center gap-12 pb-28 md:grid-cols-12 md:gap-16 md:pb-44">
        <RevealImage
          src="/images/home-2.jpg"
          alt="Ensaio no palco: um ator entrega o roteiro a uma atriz enquanto o diretor observa"
          sizes="(min-width: 768px) 58vw, 100vw"
          parallax={6}
          className="aspect-[4/3] md:col-span-7"
        />
        <div className="md:col-span-5">
          <FadeIn>
            <Eyebrow>{home.about.eyebrow}</Eyebrow>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-8 font-display text-[clamp(1.5rem,1.2rem+1.1vw,2.2rem)] leading-snug">
              <Rich text={home.about.body} />
            </p>
          </FadeIn>
          <FadeIn delay={0.3} className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
            <Button href="/escola" variant="text">
              Conheça a escola
            </Button>
            <Button href="/produtora" variant="text">
              Conheça a produtora
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* O instrumento do ator */}
      <section className="border-y border-line bg-ink-2">
        <div className="container-page grid gap-14 py-28 md:grid-cols-12 md:gap-16 md:py-40">
          <div className="md:col-span-5">
            <div className="md:sticky md:top-32">
              <FadeIn>
                <Eyebrow>{home.instrument.eyebrow}</Eyebrow>
              </FadeIn>
              <RevealText text={home.instrument.lead} className="mt-8 font-display text-[clamp(1.8rem,1.3rem+1.8vw,3rem)] leading-[1.15]" />
              <FadeIn delay={0.2}>
                <p className="mt-8 text-lg text-mute">{home.instrument.listIntro}</p>
              </FadeIn>
            </div>
          </div>
          <ol className="md:col-span-6 md:col-start-7">
            {home.instrument.items.map((item, i) => (
              <FadeIn as="li" key={item} delay={0.04 * i} y={16} className="flex items-baseline gap-6 border-b border-line py-6 first:border-t">
                <span className="w-8 shrink-0 font-display text-sm italic text-gold">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-lg leading-relaxed text-bone/90 md:text-xl">
                  <Rich text={item} />
                </span>
              </FadeIn>
            ))}
          </ol>
        </div>
      </section>

      {/* Caminhos */}
      <section className="container-page py-28 md:py-40">
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {home.pillars.map((p, i) => (
            <FadeIn key={p.href} delay={i * 0.12}>
              <Link href={p.href} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-ink-3">
                  <Image
                    src={p.image}
                    alt={p.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover opacity-80 transition-[transform,opacity] duration-[1.4s] ease-curtain group-hover:scale-105 group-hover:opacity-100"
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                    <span className="font-display text-sm italic text-gold-light">{String(i + 1).padStart(2, "0")}</span>
                    <h2 className="mt-2 font-display text-3xl md:text-4xl">{p.label}</h2>
                    <p className="mt-3 max-w-xs text-sm leading-relaxed text-bone/75">{p.text}</p>
                    <span className="mt-6 inline-flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-gold-light">
                      Saiba mais <Arrow />
                    </span>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Visite */}
      <section className="border-t border-line">
        <div className="container-page grid gap-14 py-28 md:grid-cols-12 md:gap-16 md:py-40">
          <div className="flex flex-col justify-center md:col-span-6">
            <FadeIn>
              <Eyebrow>Contato</Eyebrow>
            </FadeIn>
            <RevealText text="Venha nos conhecer." className="mt-8 font-display text-title" />
            <FadeIn delay={0.2} className="mt-12">
              <ContactList />
            </FadeIn>
            <FadeIn delay={0.3} className="mt-12">
              <Button href={whatsappLink("Olá! Gostaria de agendar uma aula no Vilela Vianna Estúdios.")}>Agende sua aula</Button>
            </FadeIn>
          </div>
          <RevealImage
            src="/images/fachada.png"
            alt={contato.facadeAlt}
            sizes="(min-width: 768px) 40vw, 100vw"
            parallax={5}
            className="aspect-[3/4] md:col-span-5 md:col-start-8"
          />
        </div>
      </section>
    </>
  );
}
