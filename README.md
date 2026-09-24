# Vilela Vianna Estúdios

Site institucional do Vilela Vianna Estúdios (escola de atuação, produtora teatral e espaço para locação em Curitiba), substituindo o antigo site no Webnode.

Next.js (App Router) + TypeScript + Tailwind CSS v4 + Motion + Lenis. Todas as páginas são estáticas.

## Rodando

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Onde mexer

| O quê | Onde |
|---|---|
| Textos de todas as páginas | `src/content/*.ts` (um arquivo por página) |
| Telefone, e-mail, endereço, Instagram, menu | `src/content/site.ts` |
| Novo convidado do mês | adicionar um item em `guests` em `src/content/convidados.ts` |
| Preços e planos | `src/content/planos.ts` |
| Cores, fontes, animações CSS | `src/app/globals.css` |
| Redirects das URLs antigas | `next.config.ts` |

Na copy, `*texto*` vira itálico e `**texto**` vira negrito.

## Imagens

As fotos vieram do site antigo em resolução máxima:

```bash
node scripts/fetch-assets.mjs     # baixa os originais para public/images
node scripts/prepare-images.mjs   # gera a logo em PNG transparente e o quadro 4:5 da Synergy
```

Para trocar uma foto, substitua o arquivo em `public/images/` mantendo o nome, ou aponte o caminho novo no arquivo de conteúdo.

## Motion

- As entradas acima da dobra (cortina de abertura, títulos do hero, imagens `priority` e transição de página) são **CSS puro** (`globals.css`). Elas pintam antes da hidratação, o que mantém o LCP baixo.
- As revelações ao rolar usam Motion (`src/components/motion/`).
- A cortina aparece só na primeira visita de cada sessão.
- Com `prefers-reduced-motion`, as animações e o scroll suave são desligados.

## Deploy

Vercel, sem configuração extra. As URLs antigas (`/servicos`, `/nosso-trabalho`, `/nossos-professores`, `/nossos-convidados`, `/nossos-planos`) redirecionam com 308 para as novas.
