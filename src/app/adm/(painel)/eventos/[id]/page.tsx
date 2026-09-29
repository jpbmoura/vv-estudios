import { notFound } from "next/navigation";
import { EventForm } from "@/components/adm/EventForm";
import { getEventById } from "@/lib/agenda/queries";

export default async function EditarEventoPage({ params }: PageProps<"/adm/eventos/[id]">) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

  return (
    <>
      <span className="eyebrow">Editar evento</span>
      <h1 className="mt-4 mb-12 font-display text-title">{event.title}</h1>
      <EventForm
        id={event.id}
        backHref={`/adm?mes=${event.startDate.slice(0, 7)}`}
        initial={{
          title: event.title,
          detail: event.detail,
          date: event.startDate,
          time: event.startTime,
          endTime: event.endTime,
          location: event.location ?? "",
          category: event.category,
          link: event.link ?? "",
          freq: event.freq === "weekly" && event.repeatEvery === 2 ? "biweekly" : event.freq,
          weekdays: event.weekdays.join(","),
          monthlyMode: event.monthlyMode ?? "day",
          until: event.untilDate ?? "",
        }}
      />
    </>
  );
}
