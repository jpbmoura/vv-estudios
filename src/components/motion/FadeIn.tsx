"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import { EASE } from "./ease";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "section" | "article";
  /** abertura da página: anima em CSS assim que pinta (e espera a cortina de intro) */
  hero?: boolean;
};

export function FadeIn({ children, className, delay = 0, y = 24, as = "div", hero = false }: Props) {
  const reduce = useReducedMotion();
  const Comp = motion[as];

  if (hero) {
    const Plain = as;
    return (
      <Plain className={`hero-in ${className ?? ""}`} style={{ "--d": `${delay}s`, "--y": `${y}px` } as CSSProperties}>
        {children}
      </Plain>
    );
  }

  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={reduce ? { duration: 0 } : { duration: 1.1, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}
