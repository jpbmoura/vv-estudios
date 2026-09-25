import Link from "next/link";
import { MonthNav } from "@/components/agenda/MonthNav";
import { DeleteButton } from "@/components/adm/DeleteButton";
import { buttonClass } from "@/components/ui/Button";
import { categoryLabel } from "@/content/agenda";
import { currentMonth, formatMonth, formatShortDate, formatTime, formatWeekday, parseMonth } from "@/lib/agenda/dates";
import { getEventsByMonthFresh } from "@/lib/agenda/queries";
import { getAgendaEnabledFresh } from "@/lib/settings";
import { toggleAgenda } from "../actions";

export default async function AdmPage({ searchParams }: PageProps<"/adm">) {
  const { mes } = await searchParams;
  const current = currentMonth();
  const month = parseMonth(mes) ?? current;
  const [list, enabled] = await Promise.all([getEventsByMonthFresh(month), getAgendaEnabledFresh()]);

  return (
    <>
      <div
        className={`mb-12 flex flex-col gap-5 border px-6 py-5 sm:flex-row sm:items-center sm:justify-between ${
          enabled ? "border-gold/50 bg-gold/5" : "border-line bg-ink-2"
        }`}
      >
        <div>
          <p className="flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.24em]">
            <span aria-hidden className={`size-2 rounded-full ${enabled ? "bg-gold-light" : "bg-mute/60"}`} />
            <span className={enabled ? "text-gold-light" : "text-mute"}>{enabled ? "Agenda visível no site" : "Agenda oculta no site"}</span>
          </p>
          <p className="mt-2 text-sm text-mute">
            {enabled
              ? "O menu, a página Agenda e os próximos eventos da home estão no ar."
              : "Nada da agenda aparece para os visitantes. Você pode cadastrar eventos e habilitar quando estiver pronta."}
          </p>
        </div>
        <form action={toggleAgenda} className="shrink-0">
          <input type="hidden" name="enabled" value={String(!enabled)} />
          <input type="hidden" name="mes" value={month} />
          <button type="submit" className={buttonClass(enabled ? "outline" : "solid", "cursor-pointer")}>
            <span className="relative">{enabled ? "Desabilitar agenda" : "Habilitar agenda"}</span>
          </button>
        </form>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="eyebrow">Agenda</span>
          <h1 className="mt-4 font-display text-title first-letter:uppercase">{formatMonth(month)}</h1>
        </div>
        <Link href={`/adm/eventos/novo?mes=${month}`} className={buttonClass("solid")}>
          <span className="relative">Novo evento</span>
        </Link>
      </div>

      <div className="mt-10">
        <MonthNav month={month} current={current} basePath="/adm" />
      </div>

      {list.length === 0 ? (
        <p className="py-20 text-center text-mute">Nenhum evento cadastrado neste mês.</p>
      ) : (
        <ul className="divide-y divide-line border-b border-line">
          {list.map((event) => {
            const date = new Date(event.startsAt);
            return (
              <li key={event.id} className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:gap-8">
                <div className="w-44 shrink-0 text-sm">
                  <span className="block font-display text-xl text-bone">
                    {formatShortDate(date)} · {formatTime(date)}
                  </span>
                  <span className="block text-mute first-letter:uppercase">{formatWeekday(date)}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gold-light">
                    {categoryLabel(event.category)}
                  </span>
                  <p className="mt-1 truncate text-lg text-bone">{event.title}</p>
                  {event.location && <p className="truncate text-sm text-mute">{event.location}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-6">
                  <Link
                    href={`/adm/eventos/${event.id}`}
                    className="link-underline pb-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-bone/80 hover:text-bone"
                  >
                    Editar
                  </Link>
                  <DeleteButton id={event.id} month={month} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
