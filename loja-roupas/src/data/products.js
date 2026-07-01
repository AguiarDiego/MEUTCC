export const staticProducts = [
  {
    id: 1,
    name: 'Blusa Moletom - Branca',
    image: '/Imagem/Branca/1.png',
    price: '119,90',
    pricePix: '113,90',
    installment: '30,00',
  },
  {
    id: 2,
    name: 'Blusa Moletom - Preta',
    image: '/Imagem/Preta/5.png',
    price: '119,90',
    pricePix: '113,90',
    installment: '30,00',
  },
  {
    id: 3,
    name: 'Blusa Moletom - Cinza',
    image: '/Imagem/Cinza/9.png',
    price: '119,90',
    pricePix: '113,90',
    installment: '30,00',
  },
];

// Converte um preço em formato "119,90" para número (119.9)
export function parsePrice(value) {
  if (typeof value === 'number') return value;
  return parseFloat(value.replace(/\./g, '').replace(',', '.'));
}

// Formata um número como moeda brasileira, ex: 119.9 -> "R$ 119,90"
export function formatPrice(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
