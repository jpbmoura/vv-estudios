export type Plan = {
  title: string;
  price?: string;
  unit?: string;
  body: readonly string[];
  details?: readonly string[];
  cta: string;
};

export const planos = {
  title: "Nossos Planos",
  intro:
    "O Vilela Vianna Estúdios foi pensado para diferentes perfis, momentos e necessidades. Por isso, oferecemos várias modalidades de aulas e faixas de investimento, para que cada aluno encontre a opção que melhor se encaixa na sua rotina e nos seus objetivos. Confira nossos preços especiais de inauguração!",
  monthly: [
    {
      title: "Aulas Avulsas",
      price: "R$ 160",
      unit: "por aula",
      body: [
        "Escolha um dos dias letivos do mês e venha exercitar sua arte. Você pode participar da proposta da aula, experimentar novas ferramentas de atuação ou trazer uma cena ou monólogo para trabalhar e receber *feedback*.",
      ],
      details: ["Duração: 3 horas"],
      cta: "Agendar aula avulsa",
    },
    {
      title: "Pacote de 5 aulas no mês",
      price: "R$ 590",
      unit: "por mês",
      body: [
        "Escolha 5 dias letivos ao longo do mês para frequentar o Estúdio. O pacote permite acompanhar diferentes propostas de treinamento, aprofundar técnicas de atuação e trabalhar cenas ou monólogos com orientação e *feedback*.",
      ],
      details: ["5 aulas de 3 horas cada"],
      cta: "Quero o pacote de 5 aulas",
    },
    {
      title: "Pacote de 10 aulas no mês",
      price: "R$ 890",
      unit: "por mês",
      body: [
        "Para quem quer manter uma prática mais constante, o pacote de 10 aulas permite uma imersão maior no trabalho do Estúdio, com acesso a diferentes exercícios, técnicas e processos de construção de personagem. Você também pode trabalhar várias cenas e monólogos ao longo do mês.",
      ],
      details: ["10 aulas de 3 horas cada"],
      cta: "Quero o pacote de 10 aulas",
    },
    {
      title: "Pacote Ilimitado",
      price: "R$ 1.000",
      unit: "por mês",
      body: [
        "A experiência de maior imersão no Vilela Vianna Estúdios. Durante o mês contratado, você pode participar de **todos os dias letivos disponíveis**, com acesso às diferentes aulas, técnicas e propostas do Estúdio, e desenvolver continuamente cenas, monólogos e personagens.",
      ],
      details: ["Acesso ilimitado às aulas do mês", "Cada dia tem duração de 3 horas"],
      cta: "Quero o pacote ilimitado",
    },
  ] satisfies Plan[],
  more: [
    {
      title: "Aulas Particulares",
      price: "R$ 250",
      unit: "por hora",
      body: [
        "Precisa se preparar para uma audição, um teste, um personagem ou um projeto específico? Ou prefere desenvolver seu trabalho de forma individual?",
        "As aulas particulares são encontros personalizados, pensados de acordo com as necessidades e os objetivos de cada ator.",
      ],
      details: ["Duração: 1 hora"],
      cta: "Agendar aula particular",
    },
    {
      title: "Locação do Espaço",
      price: "R$ 180",
      unit: "por hora",
      body: [
        "Um espaço versátil e acolhedor para ensaios, *workshops*, cursos, preparação de elenco, *castings*, gravações e produções audiovisuais, com capacidade para até 25 pessoas.",
        "O espaço conta com sala principal de 46 m², camarim, almoxarifado e estúdio com vedação acústica, oferecendo estrutura e privacidade para diferentes tipos de trabalho artístico. Locação por hora, período ou diária.",
      ],
      cta: "Consultar disponibilidade",
    },
    {
      title: "Bolsa de Estudos",
      body: [
        "Acreditamos que o treinamento artístico também deve chegar a quem, neste momento, não consegue arcar com todo o investimento.",
        "Por isso, o Vilela Vianna Estúdios abre candidaturas para bolsas de estudo mensais, de acordo com critérios, disponibilidade e avaliação do Estúdio. Para saber mais e se candidatar, entre em contato conosco.",
      ],
      cta: "Quero me candidatar",
    },
  ] satisfies Plan[],
  terms: {
    title: "Funcionamento e Contratação",
    body: [
      "Os planos do Vilela Vianna Estúdios são contratados mensalmente e não têm renovação automática. A cada novo mês, os alunos podem fazer uma nova contratação de acordo com a programação e a disponibilidade de aulas divulgadas pelo Estúdio.",
      "O Vilela Vianna nasce também da experiência de profissionais que continuam em atividade no mercado artístico. Por isso, nossa agenda acompanha a dinâmica real dessa profissão.",
      "Por conta de compromissos profissionais, como filmagens, espetáculos, viagens e outros projetos artísticos, pode haver períodos em que determinadas aulas ou atividades não serão oferecidas. Nesses casos, a programação é informada com antecedência e não há cobrança referente ao período sem aulas.",
      "Esse formato nos permite manter uma relação transparente com nossos alunos e, ao mesmo tempo, preservar um dos princípios do Estúdio: aprender em contato permanente com a prática e com o mercado profissional.",
    ],
  },
} as const;
