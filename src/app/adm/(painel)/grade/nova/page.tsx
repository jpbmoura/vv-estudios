import { ClassForm } from "@/components/adm/ClassForm";

export default function NovaAulaPage() {
  return (
    <>
      <span className="eyebrow">Nova aula</span>
      <h1 className="mt-4 mb-12 font-display text-title">Cadastrar aula</h1>
      <ClassForm id={null} initial={{ title: "", weekdays: "", time: "19:00", endTime: "20:00", biweekly: "false", active: "true" }} />
    </>
  );
}
