import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline" | "text";
  className?: string;
};

const base =
  "group relative inline-flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.24em] transition-colors duration-500 ease-curtain";

const variants = {
  solid:
    "overflow-hidden bg-gold px-7 py-4 text-ink before:absolute before:inset-0 before:origin-bottom before:scale-y-0 before:bg-bone before:transition-transform before:duration-500 before:ease-curtain hover:before:scale-y-100",
  outline:
    "overflow-hidden border border-gold/60 px-7 py-4 text-bone before:absolute before:inset-0 before:origin-bottom before:scale-y-0 before:bg-gold before:transition-transform before:duration-500 before:ease-curtain hover:text-ink hover:before:scale-y-100",
  text: "text-gold-light hover:text-bone",
};

export function Button({ href, children, variant = "solid", className = "" }: Props) {
  const external = /^(https?:|mailto:|tel:)/.test(href);
  const content = (
    <>
      <span className="relative">{children}</span>
      <Arrow />
    </>
  );
  const cls = `${base} ${variants[variant]} ${className}`;

  if (external) {
    const newTab = href.startsWith("http");
    return (
      <a href={href} className={cls} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}

export function Arrow() {
  return (
    <span aria-hidden className="relative block h-3 w-5 overflow-hidden">
      <svg
        viewBox="0 0 20 12"
        className="absolute inset-0 h-3 w-5 transition-transform duration-500 ease-curtain group-hover:translate-x-full"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M0 6h18M13 1l5 5-5 5" />
      </svg>
      <svg
        viewBox="0 0 20 12"
        className="absolute inset-0 h-3 w-5 -translate-x-full transition-transform duration-500 ease-curtain group-hover:translate-x-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M0 6h18M13 1l5 5-5 5" />
      </svg>
    </span>
  );
}
