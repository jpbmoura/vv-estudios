import { notFound, redirect } from "next/navigation";
import { CancelOccurrenceButton, RestoreOccurrenceButton } from "@/components/adm/OccurrenceActions";
import { OccurrenceForm } from "@/components/adm/OccurrenceForm";
import { occurrenceLabels } from "@/content/agenda";
import { formatDay, formatDayWeekday, timeRange } from "@/lib/agenda/dates";
import { describeRecurrence } from "@/lib/agenda/recurrence";
import { getOccurrence } from "@/lib/agenda/queries";

export default async function OcorrenciaPage({ params }: PageProps<"/adm/eventos/[id]/ocorrencias/[date]">) {
  const { id, date } = await params;
  const found = await getOccurrence(id, date);
  if (!found) notFound();

  const { series, exception, occurrence } = found;
  // Evento único não tem "só esta data": edita o próprio evento
  if (series.freq === "none") redirect(`/adm/eventos/${id}`);

  const month = date.slice(0, 7);

  return (
    <>
      <span className="eyebrow">Alterar uma data</span>
      <h1 className="mt-4 font-display text-title">
        <span className="italic text-gold-light">{formatDay(date)}</span> <span className="text-bone/40">{formatDayWeekday(date)}</span>
      </h1>
      <p className="mt-4 text-mute">
        {series.title} · {describeRecurrence(series)} · {timeRange(series.startTime, series.endTime)}
      </p>

      <div className="mt-8 mb-12 flex flex-wrap items-center gap-6 border-y border-line py-5">
        {occurrence.cancelled ? (
          <span className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-red-300">{occurrenceLabels.cancelled}</span>
        ) : (
          <CancelOccurrenceButton eventId={id} date={date} month={month} />
        )}
        {exception && <RestoreOccurrenceButton eventId={id} date={date} month={month} />}
        <p className="text-sm text-mute">O que ficar igual ao padrão continua acompanhando a série.</p>
      </div>

      <OccurrenceForm
        eventId={id}
        date={date}
        backHref={`/adm?mes=${month}`}
        initial={{
          title: occurrence.title,
          detail: occurrence.detail,
          location: occurrence.location ?? "",
          time: occurrence.startTime,
          endTime: occurrence.endTime,
        }}
      />
    </>
  );
}
