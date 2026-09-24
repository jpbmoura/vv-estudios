import { site } from "./site";

export const home = {
  hero: {
    eyebrow: "Vilela Vianna Estúdios",
    headline: site.tagline,
    sub: "Escola de atuação, produtora teatral e espaço para locação. Para quem está começando e para quem já vive do ofício.",
  },
  intro: {
    title: "O Vilela Vianna Estúdios tem orgulho de apresentar seu novo espaço.",
    body: "Um lugar onde a imaginação ganha vida, histórias são contadas e pessoas se emocionam.",
  },
  about: {
    eyebrow: "Quem somos",
    body: "Além de uma produtora teatral dedicada a criar e trazer as melhores peças para o público brasileiro, somos também uma escola: para novos atores e para os profissionais já formados que se perguntam: *“E agora, faço o quê?”*",
  },
  instrument: {
    eyebrow: "O instrumento do ator",
    lead: "O Vilela Vianna Estúdios nasce da ideia de que todo ator precisa manter seu instrumento (corpo, voz e imaginação) afinado e preparado.",
    listIntro: "Por isso criamos um espaço para que você, ator, possa:",
    items: [
      "aprender novas técnicas;",
      "apresentar cenas e monólogos e receber *feedback*;",
      "testar escolhas novas;",
      "aprender sobre audições e sobre atuar para a câmera;",
      "se preparar para testes e gravá-los com a melhor qualidade;",
      "aperfeiçoar a arte do improviso;",
      "cuidar da sua voz e do seu corpo;",
      "gravar cenas para o seu material;",
      "se tornar um ator completo, com aulas de teatro musical (canto e dança);",
      "e muito mais.",
    ],
  },
  pillars: [
    {
      href: "/escola",
      label: "A Escola",
      text: "Técnicas, câmera, corpo e voz, cenas, improviso e teatro musical.",
      image: "/images/escola.jpg",
      alt: "Alunos sentados em roda num palco escuro, com roteiros nas mãos, ouvindo o professor",
    },
    {
      href: "/produtora",
      label: "A Produtora",
      text: "Projetos teatrais com excelência artística, identidade e relevância.",
      image: "/images/produtora-2.jpg",
      alt: "Casal em figurino de época de mãos dadas no palco, entre candelabros acesos",
    },
    {
      href: "/planos",
      label: "Nossos Planos",
      text: "Aulas avulsas, pacotes mensais, aulas particulares e locação do espaço.",
      image: "/images/produtora-1.jpg",
      alt: "Ator de fraque em silhueta nos bastidores, iluminado por um refletor",
    },
  ],
} as const;
