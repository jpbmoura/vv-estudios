"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type CSSProperties } from "react";
import { EASE } from "./ease";

type Props = {
  src: string;
  alt: string;
  /** classes do quadro: proporção, arredondamento etc. Ex.: "aspect-[4/5]" */
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** intensidade do parallax em % da altura (0 desliga) */
  parallax?: number;
  position?: string;
  imageClassName?: string;
  delay?: number;
};

/** Imagem que se revela de baixo para cima (clip-path) com um leve zoom-out, e parallax opcional. */
export function RevealImage({
  src,
  alt,
  className = "",
  sizes = "100vw",
  priority,
  parallax = 0,
  position = "center",
  imageClassName = "",
  delay = 0,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${parallax}%`, `${parallax}%`]);
  const usesParallax = parallax > 0 && !reduce;

  const img = (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      quality={85}
      className={`object-cover ${imageClassName}`}
      style={{ objectPosition: position }}
    />
  );

  // Imagens "priority" estão acima da dobra: revelação em CSS, que pinta antes da hidratação
  if (priority) {
    return (
      <div
        ref={ref}
        className={`img-in relative overflow-hidden bg-ink-3 ${className}`}
        style={{ "--d": `${delay}s` } as CSSProperties}
      >
        <motion.div className="absolute inset-0" style={usesParallax ? { y, scale: 1 + (parallax * 2.2) / 100 } : undefined}>
          {img}
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden bg-ink-3 ${className}`}
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={reduce ? { duration: 0 } : { duration: 1.4, ease: EASE, delay }}
    >
      <motion.div
        className="absolute inset-0"
        style={usesParallax ? { y, scale: 1 + (parallax * 2.2) / 100 } : undefined}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.12 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={reduce ? { duration: 0 } : { duration: 1.8, ease: EASE, delay }}
        >
          {img}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
