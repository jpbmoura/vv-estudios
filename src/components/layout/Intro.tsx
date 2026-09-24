"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export const INTRO_KEY = "vv-intro-seen";

/**
 * Roda no <head> antes da pintura: se a intro já foi vista nesta sessão
 * (ou o usuário prefere menos movimento), marca o <html> e o CSS esconde a cortina.
 */
export const introScript = `try{if(sessionStorage.getItem('${INTRO_KEY}')==='1'||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.dataset.intro='seen'}catch(e){}`;

/** Atraso extra para animações de entrada enquanto a cortina ainda está na tela. */
export function introDelay() {
  if (typeof document === "undefined") return 0;
  return document.documentElement.dataset.intro === "seen" ? 0 : 1.35;
}

/**
 * Cortina de abertura, só na primeira visita da sessão. Toda a coreografia é CSS
 * (globals.css), cronometrada a partir da primeira pintura, para ficar em sincronia
 * com as entradas do hero, que também são CSS. O JS só tira a cortina do DOM depois.
 */
export function Intro() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {}
    const root = document.documentElement;
    const alreadySeen = root.dataset.intro === "seen";
    const hide = setTimeout(() => setShow(false), alreadySeen ? 0 : 2700);
    // Só depois que as entradas do hero terminaram: trocar o atraso no meio faria elas pularem
    const seen = setTimeout(() => (root.dataset.intro = "seen"), alreadySeen ? 0 : 4200);
    return () => {
      clearTimeout(hide);
      clearTimeout(seen);
    };
  }, []);

  if (!show) return null;

  return (
    <div aria-hidden className="intro fixed inset-0 z-[70] flex flex-col items-center justify-center gap-8 bg-ink">
      <div className="intro-logo relative h-28 w-44 md:h-36 md:w-56">
        <Image src="/images/logo.png" alt="" fill sizes="224px" priority className="object-contain" />
      </div>
      <span className="intro-line block h-px w-40 bg-gold" />
    </div>
  );
}
