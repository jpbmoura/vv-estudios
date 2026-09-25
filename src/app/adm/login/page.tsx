import Image from "next/image";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { LoginForm } from "@/components/adm/LoginForm";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/adm");

  return (
    <section className="container-page flex min-h-dvh flex-col items-center justify-center py-16 text-center">
      <span className="relative mb-10 block h-16 w-24">
        <Image src="/images/logo.png" alt="" fill sizes="96px" priority className="object-contain" />
      </span>
      <span className="eyebrow">Painel</span>
      <h1 className="mt-5 font-display text-title">Bastidores</h1>
      <LoginForm />
    </section>
  );
}
