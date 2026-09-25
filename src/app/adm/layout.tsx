import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Painel",
  robots: { index: false, follow: false },
};

export default function AdmLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-ink">{children}</div>;
}
