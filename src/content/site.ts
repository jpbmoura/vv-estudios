export const site = {
  name: "Vilela Vianna Estúdios",
  url: "https://www.vilelaviannaestudios.com.br",
  tagline: "Histórias começam muito antes de a cortina se abrir.",
  description:
    "Escola de atuação, produtora teatral e espaço para locação em Curitiba. Um lugar onde a imaginação ganha vida, histórias são contadas e pessoas se emocionam.",
  email: "vilelaviannaestudios@gmail.com",
  phone: "(41) 98809-7186",
  phoneHref: "tel:+5541988097186",
  whatsapp: "5541988097186",
  instagram: "@vilelaviannaestudios",
  instagramHref: "https://www.instagram.com/vilelaviannaestudios/",
  address: {
    street: "Rua Alberto Folloni, 1815",
    district: "Ahú",
    city: "Curitiba",
    state: "PR",
    zip: "80540-000",
  },
  mapsHref: "https://www.google.com/maps/search/?api=1&query=Rua+Alberto+Folloni,+1815,+Curitiba,+PR",
  mapsEmbed:
    "https://www.google.com/maps?q=Rua+Alberto+Folloni,+1815,+Ah%C3%BA,+Curitiba,+PR&output=embed",
} as const;

export const nav = [
  { href: "/", label: "Início" },
  { href: "/escola", label: "A Escola" },
  { href: "/produtora", label: "A Produtora" },
  { href: "/professores", label: "Nossos Professores" },
  { href: "/convidados", label: "Nossos Convidados" },
  { href: "/planos", label: "Nossos Planos" },
  { href: "/agenda", label: "Agenda" },
  { href: "/contato", label: "Contato" },
] as const;

export type NavItem = (typeof nav)[number];

/** Menu do site: a Agenda só entra quando está habilitada no /adm */
export function visibleNav(showAgenda: boolean): NavItem[] {
  return showAgenda ? [...nav] : nav.filter((item) => item.href !== "/agenda");
}

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${site.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function mailtoLink(subject?: string) {
  return subject ? `mailto:${site.email}?subject=${encodeURIComponent(subject)}` : `mailto:${site.email}`;
}
