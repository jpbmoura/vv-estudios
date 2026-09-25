import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Manrope } from "next/font/google";
import { introScript } from "@/components/layout/Intro";
import { site } from "@/content/site";
import "./globals.css";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · Escola de atuação e produtora teatral em Curitiba`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
    images: [{ url: "/images/hero.jpg", width: 1920, height: 1280, alt: "Alunos em roda num palco de teatro com cortina vermelha" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["EducationalOrganization", "PerformingArtsTheater"],
  name: site.name,
  url: site.url,
  logo: `${site.url}/images/logo-full.png`,
  image: `${site.url}/images/fachada.png`,
  email: site.email,
  telephone: "+55 41 98809-7186",
  sameAs: [site.instagramHref],
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    postalCode: site.address.zip,
    addressCountry: "BR",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${bodoni.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
