"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/adm", label: "Agenda", match: (p: string) => p === "/adm" || p.startsWith("/adm/eventos") },
  { href: "/adm/grade", label: "Grade escolar", match: (p: string) => p.startsWith("/adm/grade") },
];

/** Módulos do painel; cada um tem o seu liga/desliga */
export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Módulos" className="flex items-center gap-6 text-[0.68rem] font-semibold uppercase tracking-[0.2em]">
      {items.map((item) => {
        const active = item.match(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`border-b pb-1 transition-colors duration-500 ${active ? "border-gold text-gold-light" : "border-transparent text-mute hover:text-bone"}`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
