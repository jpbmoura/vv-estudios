import Link from "next/link";
import { formatMonthName, shiftMonth, type YearMonth } from "@/lib/agenda/dates";

type Props = {
  month: YearMonth;
  current: YearMonth;
  basePath: string;
  /** Último mês navegável (a agenda pública vai só até o próximo mês) */
  max?: YearMonth;
};

const linkClass =
  "group inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gold-light transition-colors duration-500 hover:text-bone";

export function MonthNav({ month, current, basePath, max }: Props) {
  const prev = shiftMonth(month, -1);
  const next = shiftMonth(month, 1);
  const hasNext = !max || next <= max;
  const href = (ym: YearMonth) => (ym === current ? basePath : `${basePath}?mes=${ym}`);

  return (
    <nav aria-label="Navegar entre meses" className="flex items-center justify-between gap-4 border-y border-line py-5">
      <Link href={href(prev)} scroll={false} className={linkClass}>
        <span aria-hidden className="transition-transform duration-500 ease-curtain group-hover:-translate-x-1">
          ←
        </span>
        <span className="capitalize">{formatMonthName(prev)}</span>
      </Link>

      {month !== current && (
        <Link href={basePath} scroll={false} className="link-underline pb-1 text-[0.66rem] font-medium uppercase tracking-[0.22em] text-bone/70 hover:text-bone">
          Mês atual
        </Link>
      )}

      {hasNext ? (
        <Link href={href(next)} scroll={false} className={linkClass}>
          <span className="capitalize">{formatMonthName(next)}</span>
          <span aria-hidden className="transition-transform duration-500 ease-curtain group-hover:translate-x-1">
            →
          </span>
        </Link>
      ) : (
        <span aria-hidden className="w-16" />
      )}
    </nav>
  );
}
