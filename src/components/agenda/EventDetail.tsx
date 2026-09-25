"use client";

import { useId, useState } from "react";

// Abaixo disso o texto cabe nas duas linhas do resumo e não precisa de "Ler mais"
const SHORT = 180;

export function EventDetail({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const long = text.length > SHORT || text.split("\n").length > 2;

  return (
    <div className="mt-4 max-w-2xl">
      {/* Fechado, os parágrafos viram uma linha só: senão uma linha em branco gasta metade do resumo */}
      <p id={id} className={`leading-relaxed text-bone/75 ${long && !open ? "line-clamp-2" : "whitespace-pre-line"}`}>
        {long && !open ? text.replace(/\s*\n+\s*/g, " ") : text}
      </p>
      {long && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={id}
          className="link-underline mt-3 cursor-pointer pb-1 text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-gold-light hover:text-bone"
        >
          {open ? "Mostrar menos" : "Ler mais"}
        </button>
      )}
    </div>
  );
}
