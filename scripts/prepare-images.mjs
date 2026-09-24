// Prepara as imagens baixadas por fetch-assets.mjs.
// Uso: node scripts/prepare-images.mjs
//
// 1. Logo: o JPEG original tem fundo quase preto; gera PNGs transparentes.
import sharp from "sharp";

for (const name of ["logo", "logo-full"]) {
  const { data, info } = await sharp(`public/images/${name}.jpg`).raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, j = 0; i < data.length; i += info.channels, j += 4) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    const a = Math.max(0, Math.min(1, (Math.max(r, g, b) - 22) / 45));
    out[j] = r;
    out[j + 1] = g;
    out[j + 2] = b;
    out[j + 3] = Math.round(a * 255);
  }
  await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim()
    .png({ compressionLevel: 9 })
    .toFile(`public/images/${name}.png`);
  console.log(`${name}.png`);
}

// 2. Synergy: logo quase quadrado; estende em cima e embaixo repetindo a borda
//    para caber no quadro 4:5 dos professores sem faixas.
const synergy = await sharp("public/images/synergy.jpg")
  .extend({ top: 108, bottom: 108, extendWith: "copy" })
  .jpeg({ quality: 90 })
  .toFile("public/images/synergy-4x5.jpg");
console.log(`synergy-4x5.jpg ${synergy.width}x${synergy.height}`);
