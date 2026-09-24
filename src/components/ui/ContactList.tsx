import { mailtoLink, site, whatsappLink } from "@/content/site";

const items = [
  {
    label: "Endereço",
    href: site.mapsHref,
    lines: [
      site.address.street,
      `${site.address.district} · ${site.address.city}/${site.address.state}`,
      `CEP ${site.address.zip}`,
    ],
  },
  { label: "WhatsApp", href: whatsappLink(), lines: [site.phone] },
  { label: "E-mail", href: mailtoLink(), lines: [site.email] },
  { label: "Instagram", href: site.instagramHref, lines: [site.instagram] },
];

export function ContactList({ className = "" }: { className?: string }) {
  return (
    <dl className={`divide-y divide-line border-y border-line ${className}`}>
      {items.map((item) => {
        const newTab = item.href.startsWith("http");
        return (
          <div key={item.label} className="grid gap-2 py-6 sm:grid-cols-[11rem_1fr] sm:gap-6">
            <dt className="pt-1 text-[0.68rem] font-medium uppercase tracking-[0.28em] text-gold-light">{item.label}</dt>
            <dd>
              <a
                href={item.href}
                {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="link-underline break-words font-display text-xl leading-snug text-bone md:text-2xl"
              >
                {item.lines.map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </a>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
