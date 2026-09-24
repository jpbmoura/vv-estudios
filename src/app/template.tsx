/**
 * Entrada de cada página: filete dourado atravessa o topo e o conteúdo sobe suavemente.
 * Em CSS (não JS) para o conteúdo pintar antes da hidratação; o template remonta a cada
 * navegação, então as animações recomeçam sozinhas.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span
        aria-hidden
        className="page-line fixed inset-x-0 top-0 z-[55] h-px bg-gradient-to-r from-transparent via-gold-light to-transparent"
      />
      <div className="page-in">{children}</div>
    </>
  );
}
