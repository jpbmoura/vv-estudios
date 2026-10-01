import { notFound } from "next/navigation";
import { ClassForm } from "@/components/adm/ClassForm";
import { getClassById } from "@/lib/grade/queries";

export default async function EditarAulaPage({ params }: PageProps<"/adm/grade/[id]">) {
  const { id } = await params;
  const schoolClass = await getClassById(id);
  if (!schoolClass) notFound();

  return (
    <>
      <span className="eyebrow">Editar aula</span>
      <h1 className="mt-4 mb-12 font-display text-title">{schoolClass.title}</h1>
      <ClassForm
        id={schoolClass.id}
        initial={{
          title: schoolClass.title,
          weekdays: schoolClass.weekdays.join(","),
          time: schoolClass.startTime,
          endTime: schoolClass.endTime,
          biweekly: String(schoolClass.biweekly),
          active: String(schoolClass.active),
        }}
      />
    </>
  );
}
