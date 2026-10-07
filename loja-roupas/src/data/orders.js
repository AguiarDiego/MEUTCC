// Dados fake de pedidos, simulando o formato que a API da equipe de back-end vai devolver.
// Quando a API estiver pronta, isso vira um fetch() no lugar desse array fixo.
export const orders = [
  {
    id: 1001,
    cliente: {
      nome: 'Amanda Aguiar',
      contato: 'amanda.aguiar@email.com',
    },
    itens: [
      { nome: 'Blusa Moletom - Branca', quantidade: 2 },
      { nome: 'Blusa Moletom - Preta', quantidade: 1 },
    ],
    valorTotal: 359.70,
    endereco: 'R. Interna Grupo Bandeirante 138, Jardim Belval, Barueri, 06420-150',
    status: 'pagamento', // 'pagamento' | 'preparo' | 'enviado'
  },
  {
    id: 1002,
    cliente: {
      nome: 'Carlos Eduardo',
      contato: '11 98765-4321',
    },
    itens: [{ nome: 'Blusa Moletom - Cinza', quantidade: 1 }],
    valorTotal: 119.90,
    endereco: 'Av. Paulista 1000, Bela Vista, São Paulo, 01310-100',
    status: 'preparo',
  },
  {
    id: 1003,
    cliente: {
      nome: 'Julia Ferreira',
      contato: 'julia.f@email.com',
    },
    itens: [
      { nome: 'Blusa Moletom - Branca', quantidade: 1 },
      { nome: 'Blusa Moletom - Cinza', quantidade: 1 },
    ],
    valorTotal: 239.80,
    endereco: 'Rua das Flores 55, Centro, Campinas, 13010-000',
    status: 'enviado',
  },
];