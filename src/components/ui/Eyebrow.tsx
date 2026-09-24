/** Rótulo entre filetes dourados terminados em ponto, como na logo completa. */
export function Eyebrow({ children, className = "", both = false }: { children: React.ReactNode; className?: string; both?: boolean }) {
  return (
    <span className={`eyebrow ${className}`}>
      <Rule />
      {children}
      {both && <Rule flip />}
    </span>
  );
}

function Rule({ flip = false }: { flip?: boolean }) {
  return (
    <span aria-hidden className={`flex items-center ${flip ? "flex-row-reverse" : ""}`}>
      <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold" style={flip ? { transform: "scaleX(-1)" } : undefined} />
      <span className="size-[5px] rounded-full bg-gold" />
    </span>
  );
}
