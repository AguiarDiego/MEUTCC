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
  {
    id: 4,
    name: 'Camisa GuetoSL - Branca',
    image: '/Imagem/Branca/1.png',
    price: '69,90',
    pricePix: '66,40',
  },
  {
    id: 5,
    name: 'Camisa GuetoSL - Preta',
    image: '/Imagem/Preta/5.png',
    price: '69,90',
    pricePix: '66,40',
  },
  {
    id: 6,
    name: 'Camisa GuetoSL - Cinza',
    image: '/Imagem/Cinza/9.png',
    price: '69,90',
    pricePix: '66,40',
  },
  {
    id: 7,
    name: 'Bermuda Moletom - Branca',
    image: '/Imagem/Branca/1.png',
    price: '119,90',
    pricePix: '113,90',
    installment: '30,00',
  },
  {
    id: 8,
    name: 'Bermuda Moletom - Preta',
    image: '/Imagem/Preta/5.png',
    price: '119,90',
    pricePix: '113,90',
    installment: '30,00',
  },
  {
    id: 9,
    name: 'Bermuda Moletom - Cinza',
    image: '/Imagem/Cinza/BermudaCinza.jpg',
    price: '119,90',
    pricePix: '113,90',
    installment: '30,00',
  },
];

export function parsePrice(value) {
  if (typeof value === 'number') return value;
  return parseFloat(value.replace(/\./g, '').replace(',', '.'));
}

export function formatPrice(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
