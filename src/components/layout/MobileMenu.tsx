"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useEffect } from "react";
import { site, whatsappLink, type NavItem } from "@/content/site";
import { EASE } from "../motion/ease";

export function MobileMenu({ nav, pathname, onClose }: { nav: NavItem[]; pathname: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-[45] flex flex-col bg-ink-2 pt-24 xl:hidden"
      initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
      animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
      exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
      transition={{ duration: 0.9, ease: EASE }}
      data-lenis-prevent
    >
      <nav aria-label="Menu" className="container-page flex-1 overflow-y-auto">
        <ul className="border-t border-line">
          {nav.map((item, i) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <li key={item.href} className="overflow-hidden border-b border-line">
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "100%", transition: { duration: 0.4, ease: EASE } }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.25 + i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className="flex items-baseline gap-4 py-4"
                  >
                    <span className="w-6 text-[0.65rem] tracking-[0.2em] text-gold">{String(i + 1).padStart(2, "0")}</span>
                    <span
                      className={`font-display text-[clamp(1.9rem,7vw,3rem)] leading-none ${
                        active ? "italic text-gold-light" : "text-bone"
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              </li>
            );
          })}
        </ul>
      </nav>

      <motion.div
        className="container-page flex flex-wrap gap-x-8 gap-y-2 py-8 text-sm text-mute"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.7, duration: 0.8 } }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
      >
        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-bone">
          WhatsApp {site.phone}
        </a>
        <a href={site.instagramHref} target="_blank" rel="noopener noreferrer" className="hover:text-bone">
          {site.instagram}
        </a>
      </motion.div>
    </motion.div>
  );
}
