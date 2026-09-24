// Baixa as imagens originais (resolução máxima) do site antigo no Webnode.
// Uso: node scripts/fetch-assets.mjs
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const CDN = "https://d59b3f773b.clvaw-cdnwnd.com/7ee1c8aac2b7bf7350e1cadc3f5975f9";
const OUT = path.join(process.cwd(), "public/images");

const assets = {
  "logo.jpg": "200000041-b17cfb17d1/WhatsApp%20Image%202026-09-18%20at%2013.57.38.jpeg",
  "logo-full.jpg": "200000039-edd8bedd8d/WhatsApp%20Image%202026-09-18%20at%2013.56.43.jpeg",
  "hero.jpg": "200000071-5caab5caad/pexels-cottonbro-6896179.jpeg",
  "home-2.jpg": "200000057-2275222754/pexels-cottonbro-6896188.jpeg",
  "fachada.png": "200000105-de3fede401/IMG_0323.png",
  "escola.jpg": "200000048-a1d5ea1d5f/pexels-cottonbro-6896194.jpeg",
  "produtora-1.jpg": "200000061-f0f6ff0f70/pexels-cottonbro-6899930.jpeg",
  "produtora-2.jpg": "200000060-4c8c14c8c3/pexels-cottonbro-6899929.jpeg",
  "fernanda.jpg": "200000095-870098700a/WhatsApp%20Image%202026-09-21%20at%2019.35.46.jpeg",
  "colby.jpg": "200000097-86be486be7/WhatsApp%20Image%202026-09-21%20at%2019.35.45%20%281%29.jpeg",
  "synergy.jpg": "200000099-b8bc3b8bc5/WhatsApp%20Image%202026-09-21%20at%2019.35.45.jpeg",
  "lorena.jpg": "200000083-f2deaf2ded/WhatsApp%20Image%202026-09-21%20at%2016.30.18.jpeg",
};

await mkdir(OUT, { recursive: true });

for (const [name, file] of Object.entries(assets)) {
  const res = await fetch(`${CDN}/${file}?ph=d59b3f773b`);
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(path.join(OUT, name), buf);
  console.log(`${name}  ${(buf.length / 1024).toFixed(0)} KB`);
}
