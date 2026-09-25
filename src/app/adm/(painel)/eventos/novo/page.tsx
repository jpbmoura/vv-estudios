import { EventForm } from "@/components/adm/EventForm";
import { currentMonth, parseMonth, toInputValues } from "@/lib/agenda/dates";

export default async function NovoEventoPage({ searchParams }: PageProps<"/adm/eventos/novo">) {
  const { mes } = await searchParams;
  const current = currentMonth();
  const month = parseMonth(mes) ?? current;
  // Sugere hoje no mês atual, ou o dia 1º do mês que o adm estava vendo
  const date = month === current ? toInputValues(new Date()).date : `${month}-01`;

  return (
    <>
      <span className="eyebrow">Novo evento</span>
      <h1 className="mt-4 mb-12 font-display text-title">Cadastrar evento</h1>
      <EventForm
        id={null}
        backHref={`/adm?mes=${month}`}
        initial={{ title: "", detail: "", date, time: "19:00", location: "", category: "espetaculo", link: "" }}
      />
    </>
  );
}
