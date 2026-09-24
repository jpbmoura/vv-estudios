import type { NextConfig } from "next";

// URLs do site antigo (Webnode) → novas rotas
const legacy: Record<string, string> = {
  "/servicos": "/escola",
  "/nosso-trabalho": "/produtora",
  "/nossos-professores": "/professores",
  "/nossos-convidados": "/convidados",
  "/nossos-planos": "/planos",
};

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
  },
  async redirects() {
    // A versão com barra final ("/servicos/") já é normalizada pelo Next antes de chegar aqui
    return Object.entries(legacy).map(([source, destination]) => ({ source, destination, permanent: true }));
  },
};

export default nextConfig;
