"use client";

import { useEffect, useState, useTransition } from "react";
import { deleteEvent } from "@/app/adm/actions";

/** Exclusão em dois cliques, sem window.confirm */
export function DeleteButton({ id, month }: { id: string; month: string }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  // Desarma sozinho se ninguém confirmar
  useEffect(() => {
    if (!confirming) return;
    const t = setTimeout(() => setConfirming(false), 4000);
    return () => clearTimeout(t);
  }, [confirming]);

  const cls = "cursor-pointer pb-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] transition-colors duration-300 disabled:opacity-60";

  if (!confirming) {
    return (
      <button type="button" onClick={() => setConfirming(true)} className={`${cls} link-underline text-mute hover:text-red-300`}>
        Excluir
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => deleteEvent(id, month))}
      className={`${cls} text-red-300 hover:text-red-200`}
    >
      {pending ? "Excluindo…" : "Confirmar exclusão"}
    </button>
  );
}
