import Image from "next/image";
import Link from "next/link";

export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="group flex items-center gap-3" aria-label="Vilela Vianna Estúdios, página inicial">
      <span className="relative block h-10 w-11">
        {/* PNG transparente gerado do JPEG original (scripts/prepare-images.mjs) */}
        <Image
          src="/images/logo.png"
          alt=""
          fill
          sizes="44px"
          priority
          className="object-contain transition-transform duration-700 ease-curtain group-hover:scale-105"
        />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.05rem] tracking-[0.02em] text-bone">Vilela Vianna</span>
        <span className="mt-1 text-[0.58rem] font-medium uppercase tracking-[0.42em] text-gold-light">Estúdios</span>
      </span>
    </Link>
  );
}
