"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties, ElementType } from "react";
import { EASE } from "./ease";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** abertura da página: anima em CSS assim que pinta, em vez de esperar entrar na viewport */
  immediate?: boolean;
};

/**
 * Revela o texto palavra a palavra, cada uma subindo de dentro de uma máscara.
 * Por palavra (e não por linha) para não depender de medir quebras de linha.
 */
export function RevealText({ text, as: Tag = "h2", className, delay = 0, immediate = false }: Props) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const mask = "inline-block overflow-hidden pt-[0.08em] -mt-[0.08em] pb-[0.14em] -mb-[0.14em] align-bottom";

  if (immediate) {
    return (
      <Tag className={className} aria-label={text}>
        <span aria-hidden>
          {words.map((word, i) => (
            <span key={i} className={mask}>
              <span className="word-in" style={{ "--d": `${delay + i * 0.035}s` } as CSSProperties}>
                {word}
                {i < words.length - 1 ? "\u00A0" : ""}
              </span>
            </span>
          ))}
        </span>
      </Tag>
    );
  }

  return (
    <Tag className={className} aria-label={text}>
      <motion.span
        aria-hidden
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={reduce ? { duration: 0 } : { staggerChildren: 0.035, delayChildren: delay }}
        className="inline"
      >
        {words.map((word, i) => (
          <span key={i} className={mask}>
            <motion.span
              className="inline-block will-change-transform"
              variants={{
                hidden: { y: "110%" },
                show: { y: "0%", transition: reduce ? { duration: 0 } : { duration: 1, ease: EASE } },
              }}
            >
              {word}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
