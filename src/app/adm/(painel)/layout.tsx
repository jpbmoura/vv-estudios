import Link from "next/link";
import Image from "next/image";
import { requireAdmin } from "@/lib/auth";
import { getAgendaEnabledFresh } from "@/lib/settings";
import { logout } from "../actions";

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const agendaEnabled = await getAgendaEnabledFresh();

  return (
    <>
      <header className="border-b border-line">
        <div className="container-page flex h-16 items-center justify-between gap-6">
          <Link href="/adm" className="flex items-center gap-3">
            <span className="relative block h-8 w-9">
              <Image src="/images/logo.png" alt="" fill sizes="36px" className="object-contain" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-[0.95rem] text-bone">Vilela Vianna</span>
              <span className="mt-1 text-[0.55rem] font-medium uppercase tracking-[0.42em] text-gold-light">Painel</span>
            </span>
          </Link>
          <div className="flex items-center gap-6 text-[0.68rem] font-medium uppercase tracking-[0.2em]">
            {agendaEnabled && (
              <Link href="/agenda" target="_blank" className="link-underline pb-1 text-bone/70 hover:text-bone">
                Ver agenda
              </Link>
            )}
            <form action={logout}>
              <button type="submit" className="link-underline cursor-pointer pb-1 uppercase text-gold-light hover:text-bone">
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="container-page py-12 md:py-16">{children}</main>
    </>
  );
}
