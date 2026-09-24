"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { nav } from "@/content/site";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { EASE } from "../motion/ease";

export function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(y > 40);
    setHidden(y > 240 && y > prev);
  });

  // Fecha o menu ao trocar de página
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.documentElement.classList.toggle("lenis-stopped", open);
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden && !open ? "-100%" : "0%" }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <div
          className={`transition-[background-color,backdrop-filter,border-color] duration-700 ease-curtain border-b ${
            solid && !open ? "bg-ink/75 backdrop-blur-md border-line" : "bg-transparent border-transparent"
          }`}
        >
          <div className="container-page flex h-20 items-center justify-between">
            <Logo />

            <nav aria-label="Principal" className="hidden xl:block">
              <ul className="flex items-center gap-7">
                {nav.map((item) => {
                  const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`link-underline pb-1 text-[0.72rem] font-medium uppercase tracking-[0.2em] transition-colors duration-500 ${
                          active ? "text-gold-light" : "text-bone/80 hover:text-bone"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="group relative z-50 flex items-center gap-3 xl:hidden"
            >
              <span className="text-[0.7rem] font-medium uppercase tracking-[0.3em] text-bone/90">
                {open ? "Fechar" : "Menu"}
              </span>
              <span className="relative block h-3 w-7" aria-hidden>
                <span
                  className={`absolute left-0 h-px w-full bg-gold-light transition-transform duration-500 ease-curtain ${
                    open ? "top-1/2 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 h-px bg-gold-light transition-all duration-500 ease-curtain ${
                    open ? "top-1/2 w-full -rotate-45" : "bottom-0 w-2/3 group-hover:w-full"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>{open && <MobileMenu pathname={pathname} onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}
