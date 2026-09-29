import Link from "next/link";
import { MonthNav } from "@/components/agenda/MonthNav";
import { DeleteButton } from "@/components/adm/DeleteButton";
import { CancelOccurrenceButton, RestoreOccurrenceButton } from "@/components/adm/OccurrenceActions";
import { buttonClass } from "@/components/ui/Button";
import { categoryLabel, occurrenceLabels } from "@/content/agenda";
import { currentMonth, formatDay, formatDayNumeric, formatDayWeekday, formatHour, formatMonth, parseMonth, timeRange } from "@/lib/agenda/dates";
import { getMonthAgendaFresh, type AgendaEvent, type Occurrence } from "@/lib/agenda/queries";
import { describeRecurrence } from "@/lib/agenda/recurrence";
import { getAgendaEnabledFresh } from "@/lib/settings";
import { toggleAgenda } from "../actions";

export default async function AdmPage({ searchParams }: PageProps<"/adm">) {
  const { mes } = await searchParams;
  const current = currentMonth();
  const month = parseMonth(mes) ?? current;
  const [{ series, occurrences }, enabled] = await Promise.all([getMonthAgendaFresh(month), getAgendaEnabledFresh()]);

  const recurring = series.filter((s) => s.freq !== "none");
  const single = series.filter((s) => s.freq === "none");
  const byEvent = new Map<string, Occurrence[]>();
  for (const o of occurrences) byEvent.set(o.eventId, [...(byEvent.get(o.eventId) ?? []), o]);

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
              ? "O menu, a página Agenda, a grade da Escola e os próximos eventos da home estão no ar."
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

      {series.length === 0 ? (
        <p className="py-20 text-center text-mute">Nenhum evento cadastrado neste mês.</p>
      ) : (
        <>
          {recurring.length > 0 && (
            <section className="mt-12">
              <h2 className="eyebrow">Séries que se repetem</h2>
              <ul className="mt-6 divide-y divide-line border-y border-line">
                {recurring.map((s) => {
                  const dates = byEvent.get(s.id) ?? [];
                  return (
                    <li key={s.id} className="py-6">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
                        <div className="w-44 shrink-0 text-sm">
                          <span className="block font-display text-xl text-bone">{timeRange(s.startTime, s.endTime)}</span>
                          <span className="block text-mute">{describeRecurrence(s)}</span>
                        </div>
                        <EventSummary event={s} />
                        <Actions id={s.id} month={month} />
                      </div>

                      {dates.length > 0 && (
                        <details className="group mt-5 md:ml-52">
                          <summary className="cursor-pointer list-none text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-gold-light marker:hidden hover:text-bone">
                            <span aria-hidden className="mr-2 inline-block transition-transform duration-300 group-open:rotate-90">
                              →
                            </span>
                            {dates.length} {dates.length === 1 ? "data" : "datas"} neste mês
                            {dates.some((o) => o.cancelled || o.modified) && <span className="ml-3 text-mute">· com alterações</span>}
                          </summary>
                          <ul className="mt-4 divide-y divide-line border-y border-line">
                            {dates.map((o) => (
                              <li key={o.key} className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3 text-sm">
                                <span className={`w-40 ${o.cancelled ? "text-mute line-through" : "text-bone"}`}>
                                  {formatDayNumeric(o.date)} · <span className="first-letter:uppercase">{formatDayWeekday(o.date)}</span>
                                </span>
                                <span className={`w-24 ${o.cancelled ? "text-mute line-through" : "text-mute"}`}>{timeRange(o.startTime, o.endTime)}</span>
                                {o.cancelled && <Tag tone="red">{occurrenceLabels.cancelled}</Tag>}
                                {o.modified && <Tag>{occurrenceLabels.modified}</Tag>}
                                {o.modified && o.title !== s.title && <span className="text-mute">“{o.title}”</span>}
                                <span className="ml-auto flex items-center gap-6">
                                  <Link href={`/adm/eventos/${s.id}/ocorrencias/${o.date}`} className={linkClass}>
                                    Alterar
                                  </Link>
                                  {o.cancelled || o.modified ? (
                                    <RestoreOccurrenceButton eventId={s.id} date={o.date} month={month} />
                                  ) : (
                                    <CancelOccurrenceButton eventId={s.id} date={o.date} month={month} />
                                  )}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </details>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {single.length > 0 && (
            <section className="mt-12">
              <h2 className="eyebrow">Eventos únicos</h2>
              <ul className="mt-6 divide-y divide-line border-y border-line">
                {single.map((e) => (
                  <li key={e.id} className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:gap-8">
                    <div className="w-44 shrink-0 text-sm">
                      <span className="block font-display text-xl text-bone">
                        {formatDay(e.startDate)} · {formatHour(e.startTime)}
                      </span>
                      <span className="block text-mute first-letter:uppercase">{formatDayWeekday(e.startDate)}</span>
                    </div>
                    <EventSummary event={e} />
                    <Actions id={e.id} month={month} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </>
  );
}

const linkClass = "link-underline pb-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-bone/80 hover:text-bone";

function EventSummary({ event }: { event: AgendaEvent }) {
  return (
    <div className="min-w-0 flex-1">
      <span className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gold-light">{categoryLabel(event.category)}</span>
      <p className="mt-1 truncate text-lg text-bone">{event.title}</p>
      {event.location && <p className="truncate text-sm text-mute">{event.location}</p>}
    </div>
  );
}

function Actions({ id, month }: { id: string; month: string }) {
  return (
    <div className="flex shrink-0 items-center gap-6">
      <Link href={`/adm/eventos/${id}`} className={linkClass}>
        Editar
      </Link>
      <DeleteButton id={id} month={month} />
    </div>
  );
}

function Tag({ children, tone = "gold" }: { children: React.ReactNode; tone?: "gold" | "red" }) {
  return (
    <span
      className={`border px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.22em] ${
        tone === "red" ? "border-red-300/50 text-red-300" : "border-gold/60 text-gold-light"
      }`}
    >
      {children}
    </span>
  );
}
