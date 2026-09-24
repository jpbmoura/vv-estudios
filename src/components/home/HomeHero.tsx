"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { home } from "@/content/home";
import { RevealText } from "../motion/RevealText";
import { FadeIn } from "../motion/FadeIn";
import { Eyebrow } from "../ui/Eyebrow";
import { EASE } from "../motion/ease";
import { introDelay } from "../layout/Intro";

export function HomeHero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [delay] = useState(introDelay);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0.4]);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y, opacity: fade }}>
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1.04 }}
          transition={reduce ? { duration: 0 } : { duration: 2.6, ease: EASE, delay }}
        >
          <Image
            src="/images/hero.jpg"
            alt="Alunos sentados em roda num palco de teatro com cortina vermelha, ouvindo o professor"
            fill
            priority
            quality={85}
            sizes="100vw"
            className="object-cover object-[50%_60%]"
          />
        </motion.div>
      </motion.div>
      {/* Escurece embaixo para o texto e no topo para o header */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/5" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/80 to-transparent" />

      <div className="container-page relative pb-16 pt-40 md:pb-24">
        <FadeIn hero y={12}>
          <Eyebrow>{home.hero.eyebrow}</Eyebrow>
        </FadeIn>
        <RevealText
          as="h1"
          immediate
          delay={0.1}
          text={home.hero.headline}
          className="mt-8 max-w-[17ch] font-display text-[clamp(2.5rem,1.4rem+4.4vw,6rem)] leading-[1.04]"
        />
        <FadeIn hero delay={0.55} y={16} className="mt-8 max-w-xl text-lead text-bone/80">
          <p>{home.hero.sub}</p>
        </FadeIn>
        <FadeIn hero delay={0.9} className="mt-14 flex items-center gap-4 text-[0.68rem] uppercase tracking-[0.3em] text-mute">
          <span className="relative block h-12 w-px overflow-hidden bg-line">
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-gold-light"
              animate={reduce ? undefined : { y: ["-100%", "200%"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
          Role para conhecer
        </FadeIn>
      </div>
    </section>
  );
}
