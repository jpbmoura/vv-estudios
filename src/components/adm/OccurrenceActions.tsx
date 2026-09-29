"use client";

import { useEffect, useState, useTransition } from "react";
import { cancelOccurrence, restoreOccurrence } from "@/app/adm/actions";

const cls = "cursor-pointer pb-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] transition-colors duration-300 disabled:opacity-60";

/** Cancelar uma data da série (dois cliques, como o DeleteButton) */
export function CancelOccurrenceButton({ eventId, date, month }: { eventId: string; date: string; month: string }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  // Desarma sozinho se ninguém confirmar
  useEffect(() => {
    if (!confirming) return;
    const t = setTimeout(() => setConfirming(false), 4000);
    return () => clearTimeout(t);
  }, [confirming]);

  if (!confirming) {
    return (
      <button type="button" onClick={() => setConfirming(true)} className={`${cls} link-underline text-mute hover:text-red-300`}>
        Cancelar data
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => cancelOccurrence(eventId, date, month))}
      className={`${cls} text-red-300 hover:text-red-200`}
    >
      {pending ? "Cancelando…" : "Confirmar cancelamento"}
    </button>
  );
}

/** Volta a data ao padrão da série */
export function RestoreOccurrenceButton({ eventId, date, month }: { eventId: string; date: string; month: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => restoreOccurrence(eventId, date, month))}
      className={`${cls} link-underline text-gold-light hover:text-bone`}
    >
      {pending ? "Restaurando…" : "Restaurar padrão"}
    </button>
  );
}
