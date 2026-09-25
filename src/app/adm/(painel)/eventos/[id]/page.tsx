import { notFound } from "next/navigation";
import { EventForm } from "@/components/adm/EventForm";
import { monthOf, toInputValues } from "@/lib/agenda/dates";
import { getEventById } from "@/lib/agenda/queries";

export default async function EditarEventoPage({ params }: PageProps<"/adm/eventos/[id]">) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

  const startsAt = new Date(event.startsAt);

  return (
    <>
      <span className="eyebrow">Editar evento</span>
      <h1 className="mt-4 mb-12 font-display text-title">{event.title}</h1>
      <EventForm
        id={event.id}
        backHref={`/adm?mes=${monthOf(startsAt)}`}
        initial={{
          ...toInputValues(startsAt),
          title: event.title,
          detail: event.detail,
          location: event.location ?? "",
          category: event.category,
          link: event.link ?? "",
        }}
      />
    </>
  );
}
