import Link from "next/link";
import { adminViews, type AdminView } from "@/content/agenda";
import type { YearMonth } from "@/lib/agenda/dates";

/** Abas Lista / Calendário / Grade do /adm; a aba fica na URL (?visao=) junto com o mês */
export function ViewTabs({ view, month, current }: { view: AdminView; month: YearMonth; current: YearMonth }) {
  const href = (value: AdminView) => {
    const params = new URLSearchParams();
    if (month !== current) params.set("mes", month);
    if (value !== "lista") params.set("visao", value);
    const search = params.toString();
    return `/adm${search ? `?${search}` : ""}`;
  };

  return (
    <nav aria-label="Visualização" className="mt-10 flex gap-8 border-b border-line">
      {adminViews.tabs.map((t) => {
        const active = t.value === view;
        return (
          <Link
            key={t.value}
            href={href(t.value)}
            scroll={false}
            aria-current={active ? "page" : undefined}
            className={`-mb-px border-b pb-4 text-[0.68rem] font-semibold uppercase tracking-[0.22em] transition-colors duration-500 ${
              active ? "border-gold text-gold-light" : "border-transparent text-mute hover:text-bone"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
