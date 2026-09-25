import Image from "next/image";
import Link from "next/link";
import { mailtoLink, site, whatsappLink, type NavItem } from "@/content/site";

export function Footer({ nav }: { nav: NavItem[] }) {
  return (
    <footer className="border-t border-line bg-ink-2">
      <div className="container-page grid gap-14 py-20 md:grid-cols-12 md:py-24">
        <div className="md:col-span-5">
          <Link href="/" aria-label="Vilela Vianna Estúdios, página inicial" className="block w-56 md:w-64">
            <Image
              src="/images/logo-full.png"
              alt="Vilela Vianna Estúdios"
              width={1141}
              height={636}
              sizes="256px"
              className="h-auto w-full"
            />
          </Link>
          <p className="mt-6 max-w-xs font-display text-xl italic leading-snug text-bone/80">{site.tagline}</p>
        </div>

        <nav aria-label="Rodapé" className="md:col-span-3">
          <h2 className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-gold-light">Navegação</h2>
          <ul className="mt-6 space-y-3">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-underline text-bone/80 hover:text-bone">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <h2 className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-gold-light">Visite o Estúdio</h2>
          <address className="mt-6 space-y-3 not-italic text-bone/80">
            <a href={site.mapsHref} target="_blank" rel="noopener noreferrer" className="block hover:text-bone">
              {site.address.street}, {site.address.district}
              <br />
              {site.address.city}/{site.address.state} · CEP {site.address.zip}
            </a>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="link-underline inline-block hover:text-bone">
              {site.phone}
            </a>
            <br />
            <a href={mailtoLink()} className="link-underline inline-block break-all hover:text-bone">
              {site.email}
            </a>
            <br />
            <a href={site.instagramHref} target="_blank" rel="noopener noreferrer" className="link-underline inline-block hover:text-bone">
              {site.instagram}
            </a>
          </address>
        </div>
      </div>

      <div className="container-page flex flex-col gap-2 border-t border-line py-6 text-xs text-mute sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}. Curitiba, Paraná.
        </p>
        <p>
          Imagens de palco:{" "}
          <a href="https://www.pexels.com/@cottonbro/" target="_blank" rel="noopener noreferrer" className="hover:text-bone">
            cottonbro studio / Pexels
          </a>
        </p>
      </div>
    </footer>
  );
}
