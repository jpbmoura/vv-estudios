"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Paragraphs } from "../ui/Rich";
import { EASE } from "../motion/ease";
import { FadeIn } from "../motion/FadeIn";

type Item = { title: string; body: readonly string[] };

const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** Disciplinas numeradas; no desktop um índice fixo ao lado marca a que está na tela. */
export function ClassList({ items }: { items: readonly Item[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="grid gap-12 md:grid-cols-12 md:gap-16">
      <nav aria-label="Disciplinas" className="hidden md:col-span-4 md:block">
        <ol className="sticky top-32 space-y-1">
          {items.map((item, i) => (
            <li key={item.title}>
              <a
                href={`#${slug(item.title)}`}
                className={`group flex items-baseline gap-4 py-2 transition-colors duration-500 ${
                  active === i ? "text-bone" : "text-mute hover:text-bone/80"
                }`}
              >
                <span className="w-6 font-display text-sm italic text-gold">{String(i + 1).padStart(2, "0")}</span>
                <span className="relative">
                  {item.title}
                  {active === i && (
                    <motion.span
                      layoutId="class-indicator"
                      className="absolute -left-3 top-1/2 size-[5px] -translate-y-1/2 rounded-full bg-gold"
                      transition={{ duration: 0.6, ease: EASE }}
                    />
                  )}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="md:col-span-8">
        {items.map((item, i) => (
          <ClassBlock key={item.title} item={item} index={i} onActive={setActive} />
        ))}
      </div>
    </div>
  );
}

function ClassBlock({ item, index, onActive }: { item: Item; index: number; onActive: (i: number) => void }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <article id={slug(item.title)} ref={ref} className="scroll-mt-32 border-t border-line py-12 md:py-16">
      <FadeIn>
        <div className="flex items-baseline gap-5">
          <span className="font-display text-lg italic text-gold md:text-xl">{String(index + 1).padStart(2, "0")}</span>
          <h3 className="font-display text-[clamp(1.8rem,1.4rem+1.5vw,2.8rem)] leading-tight">{item.title}</h3>
        </div>
        <Paragraphs items={item.body} className="mt-8 max-w-[62ch] text-lg leading-relaxed text-bone/80 md:pl-12" />
      </FadeIn>
    </article>
  );
}
