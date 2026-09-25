import { Header } from "./Header";
import { Footer } from "./Footer";
import { SmoothScroll } from "./SmoothScroll";
import { WhatsAppFab } from "./WhatsAppFab";
import { Intro } from "./Intro";
import { visibleNav } from "@/content/site";
import { getAgendaEnabled } from "@/lib/settings";

/** Moldura do site público: cortina, header, rodapé, WhatsApp e grão. O /adm fica de fora. */
export async function SiteChrome({ children }: { children: React.ReactNode }) {
  const nav = visibleNav(await getAgendaEnabled());

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-gold focus:px-4 focus:py-2 focus:text-ink"
      >
        Pular para o conteúdo
      </a>
      <Intro />
      <SmoothScroll />
      <Header nav={nav} />
      <main id="conteudo">{children}</main>
      <Footer nav={nav} />
      <WhatsAppFab />
      <div className="grain" aria-hidden />
    </>
  );
}
