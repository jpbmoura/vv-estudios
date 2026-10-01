import Link from "next/link";
import { DeleteButton } from "@/components/adm/DeleteButton";
import { ToggleBanner } from "@/components/adm/ToggleBanner";
import { WeeklyTimetable } from "@/components/escola/WeeklyTimetable";
import { buttonClass } from "@/components/ui/Button";
import { escola } from "@/content/escola";
import { WEEK, weekdayShort } from "@/content/weekdays";
import { getAllClassesFresh, type SchoolClass } from "@/lib/grade/queries";
import { buildTimetable, type TimetableBlock } from "@/lib/grade/timetable";
import { getGradeEnabledFresh } from "@/lib/settings";
import { timeRange } from "@/lib/time";
import { deleteClass, toggleClassActive, toggleGrade } from "../../grade-actions";

const linkClass = "link-underline pb-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-bone/80 hover:text-bone";
const blockHref = (b: TimetableBlock) => `/adm/grade/${b.classId}`;
/** "Seg, Qua", na ordem de segunda a domingo */
const daysLabel = (days: number[]) =>
  WEEK.filter((d) => days.includes(d))
    .map((d) => weekdayShort[d])
    .join(", ");

export default async function AdmGradePage() {
  const [classes, enabled] = await Promise.all([getAllClassesFresh(), getGradeEnabledFresh()]);
  const timetable = buildTimetable(classes.filter((c) => c.active));

  return (
    <>
      <ToggleBanner
        enabled={enabled}
        label="Grade escolar"
        onText="A grade horária aparece na página da Escola."
        offText="A página da Escola fica no ar sem a grade. Você pode montar as aulas e habilitar quando estiver pronta."
        action={toggleGrade}
      />

      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="eyebrow">Grade escolar</span>
          <h1 className="mt-4 font-display text-title">Aulas da semana</h1>
        </div>
        <Link href="/adm/grade/nova" className={buttonClass("solid")}>
          <span className="relative">Nova aula</span>
        </Link>
      </div>

      {classes.length === 0 ? (
        <p className="py-20 text-center text-mute">Nenhuma aula cadastrada.</p>
      ) : (
        <>
          <section className="mt-12">
            <h2 className="eyebrow">Todas as aulas</h2>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {classes.map((c) => (
                <ClassRow key={c.id} schoolClass={c} />
              ))}
            </ul>
          </section>

          <section className="mt-16">
            <p className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-mute">
              {!enabled && (
                <span className="border border-line px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-mute">Pré-visualização: a grade está oculta no site.</span>
              )}
              Como aparece na Escola. Clique numa aula para editar.
            </p>
            {timetable.blocks.length > 0 ? (
              <>
                <h2 className="mb-10 font-display text-[clamp(1.6rem,1.2rem+1.4vw,2.6rem)] leading-tight">{escola.grade.title}</h2>
                <WeeklyTimetable timetable={timetable} hrefFor={blockHref} />
              </>
            ) : (
              <p className="border-y border-line py-12 text-center text-mute">Todas as aulas estão pausadas.</p>
            )}
          </section>
        </>
      )}
    </>
  );
}

function ClassRow({ schoolClass: c }: { schoolClass: SchoolClass }) {
  return (
    <li className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:gap-8">
      <div className="w-44 shrink-0 text-sm">
        <span className={`block font-display text-xl ${c.active ? "text-bone" : "text-mute"}`}>{timeRange(c.startTime, c.endTime)}</span>
        <span className="block text-mute">{daysLabel(c.weekdays)}</span>
      </div>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
        <p className={`truncate text-lg ${c.active ? "text-bone" : "text-mute"}`}>{c.title}</p>
        {c.biweekly && <Tag>{escola.grade.biweekly}</Tag>}
        {!c.active && <Tag muted>Pausada</Tag>}
      </div>
      <div className="flex shrink-0 items-center gap-6">
        <Link href={`/adm/grade/${c.id}`} className={linkClass}>
          Editar
        </Link>
        <form action={toggleClassActive}>
          <input type="hidden" name="id" value={c.id} />
          <input type="hidden" name="active" value={String(!c.active)} />
          <button type="submit" className={`${linkClass} cursor-pointer uppercase`}>
            {c.active ? "Pausar" : "Reativar"}
          </button>
        </form>
        <DeleteButton action={deleteClass.bind(null, c.id)} />
      </div>
    </li>
  );
}

function Tag({ children, muted = false }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <span
      className={`border px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.22em] ${muted ? "border-line text-mute" : "border-gold/60 text-gold-light"}`}
    >
      {children}
    </span>
  );
}
