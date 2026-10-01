"use server";

import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { schoolClasses } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { CLASSES_TAG } from "@/lib/grade/queries";
import { parseClassForm, type ClassFieldErrors } from "@/lib/grade/validation";
import { SETTINGS_TAG, setGradeEnabled } from "@/lib/settings";

export type ClassFormState = {
  errors?: ClassFieldErrors;
  message?: string;
  /** O que foi digitado, para o form não voltar vazio depois de um erro */
  values?: Record<string, string>;
  /** Muda a cada tentativa: o form remonta com os valores acima */
  attempt?: number;
};

function echo(formData: FormData) {
  const values: Record<string, string> = {};
  for (const key of ["title", "time", "endTime"]) values[key] = String(formData.get(key) ?? "");
  values.weekdays = formData.getAll("weekdays").map(String).join(",");
  values.biweekly = String(formData.get("biweekly") === "on");
  values.active = String(formData.get("active") === "on");
  return { values, attempt: Date.now() };
}

const isId = (v: string) => /^[0-9a-f-]{36}$/i.test(v);

/** Só a página da Escola mostra a grade */
function refreshGrade() {
  updateTag(CLASSES_TAG);
  revalidatePath("/escola");
}

export async function saveClass(_prev: ClassFormState, formData: FormData): Promise<ClassFormState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "") || null;
  if (id && !isId(id)) return { message: "Aula inválida." };
  const parsed = parseClassForm(formData);
  if ("errors" in parsed) return { errors: parsed.errors, ...echo(formData) };

  try {
    if (id) {
      await db()
        .update(schoolClasses)
        .set({ ...parsed.data, updatedAt: new Date() })
        .where(eq(schoolClasses.id, id));
    } else {
      await db().insert(schoolClasses).values(parsed.data);
    }
  } catch (err) {
    console.error("[adm] erro ao salvar aula", err);
    return { message: "Não foi possível salvar. Tente novamente em instantes.", ...echo(formData) };
  }

  refreshGrade();
  redirect("/adm/grade");
}

export async function deleteClass(id: string) {
  await requireAdmin();
  if (!isId(id)) return;
  await db().delete(schoolClasses).where(eq(schoolClasses.id, id));
  refreshGrade();
  redirect("/adm/grade");
}

/** Pausa ou reativa uma aula sem apagá-la */
export async function toggleClassActive(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!isId(id)) return;
  await db()
    .update(schoolClasses)
    .set({ active: formData.get("active") === "true", updatedAt: new Date() })
    .where(eq(schoolClasses.id, id));
  refreshGrade();
  redirect("/adm/grade");
}

/** Liga/desliga a grade na página da Escola, sem mexer na agenda */
export async function toggleGrade(formData: FormData) {
  await requireAdmin();
  await setGradeEnabled(formData.get("enabled") === "true");
  updateTag(SETTINGS_TAG);
  revalidatePath("/escola");
  redirect("/adm/grade");
}
