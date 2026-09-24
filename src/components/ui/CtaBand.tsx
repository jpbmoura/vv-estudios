import { whatsappLink } from "@/content/site";
import { RevealText } from "../motion/RevealText";
import { FadeIn } from "../motion/FadeIn";
import { Button } from "./Button";
import { Eyebrow } from "./Eyebrow";

/** Chamada final das páginas: convite para agendar uma aula. */
export function CtaBand({
  title = "Venha nos conhecer e agende a sua aula.",
  eyebrow = "Próximo ato",
}: {
  title?: string;
  eyebrow?: string;
}) {
  return (
    <section className="relative overflow-hidden border-t border-line">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[120%] w-[70%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgb(184_134_47/0.16),transparent_65%)]"
      />
      <div className="container-page relative flex flex-col items-center py-28 text-center md:py-40">
        <FadeIn y={12}>
          <Eyebrow both>{eyebrow}</Eyebrow>
        </FadeIn>
        <RevealText text={title} className="mt-8 max-w-4xl font-display text-title" />
        <FadeIn delay={0.3} className="mt-12 flex flex-wrap justify-center gap-4">
          <Button href={whatsappLink("Olá! Gostaria de agendar uma aula no Vilela Vianna Estúdios.")}>
            Agende sua aula
          </Button>
          <Button href="/planos" variant="outline">
            Ver planos
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
