import { Fragment } from "react";

// Marcação mínima usada na copy: **negrito** e *itálico*
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
        if (part.startsWith("*")) return <em key={i}>{part.slice(1, -1)}</em>;
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

export function Paragraphs({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <div className={`prose-vv ${className ?? ""}`}>
      {items.map((p) => (
        <p key={p}>
          <Rich text={p} />
        </p>
      ))}
    </div>
  );
}
