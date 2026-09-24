import type { Plan } from "@/content/planos";
import { whatsappLink } from "@/content/site";
import { Button } from "./Button";
import { Paragraphs } from "./Rich";

export function PriceCard({ plan, index }: { plan: Plan; index: number }) {
  return (
    <article className="group relative flex h-full flex-col border border-line bg-ink-2 p-7 transition-colors duration-700 ease-curtain hover:border-gold/50 md:p-9">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-700 ease-curtain group-hover:scale-x-100"
      />
      <span className="font-display text-sm italic text-gold">{String(index + 1).padStart(2, "0")}</span>
      <h3 className="mt-4 font-display text-[1.7rem] leading-tight">{plan.title}</h3>

      {plan.price ? (
        <p className="mt-6 flex flex-wrap items-baseline gap-x-2">
          <span className="whitespace-nowrap font-display text-[2.6rem] leading-none text-gold-light">{plan.price}</span>
          <span className="text-sm text-mute">{plan.unit}</span>
        </p>
      ) : (
        <p className="mt-6 font-display text-2xl italic text-gold-light">Sob avaliação</p>
      )}

      {plan.details && (
        <ul className="mt-6 space-y-2 border-y border-line py-4 text-sm text-bone">
          {plan.details.map((d) => (
            <li key={d} className="flex items-center gap-3">
              <span aria-hidden className="size-1 rounded-full bg-gold" />
              {d}
            </li>
          ))}
        </ul>
      )}

      <Paragraphs items={plan.body} className="mt-6 flex-1 leading-relaxed text-bone/75" />

      <Button
        href={whatsappLink(`Olá! Tenho interesse em: ${plan.title}.`)}
        variant="outline"
        className="mt-8 w-full justify-center"
      >
        {plan.cta}
      </Button>
    </article>
  );
}
