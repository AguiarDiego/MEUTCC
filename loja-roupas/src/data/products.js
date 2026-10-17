export const staticProducts = [
  {
    id: 1,
    name: 'Blusa Moletom - Branca',
    image: '/Imagem/MoletomBranco/1.png',
images: [
  '/Imagem/MoletomBranco/1.png',
  '/Imagem/MoletomBranco/2.png',
  '/Imagem/MoletomBranco/3.png',
  '/Imagem/MoletomBranco/4.png',
],
    price: '119,90',
    pricePix: '113,90',
    installment: '30,00',
  },
  {
    id: 2,
    name: 'Blusa Moletom - Preta',
    image: '/Imagem/MoletomPreto/5.png',
images: [
  '/Imagem/MoletomPreto/5.png',
  '/Imagem/MoletomPreto/6.png',
  '/Imagem/MoletomPreto/7.png',
  '/Imagem/MoletomPreto/8.png',
],
    price: '119,90',
    pricePix: '113,90',
    installment: '30,00',
  },
  {
    id: 3,
    name: 'Blusa Moletom - Cinza',
    image: '/Imagem/MoletomCinza/9.png',
images: [
  '/Imagem/MoletomCinza/9.png',
  '/Imagem/MoletomCinza/10.png',
  '/Imagem/MoletomCinza/11.png',
  '/Imagem/MoletomCinza/12.png',
],
    price: '119,90',
    pricePix: '113,90',
    installment: '30,00',
  },
  {
    id: 4,
    name: 'Camisa GuetoSL - Branca',
    image: '/Imagem/CamisaBranca/CamisaBranca.png',
images: [
  '/Imagem/CamisaBranca/CamisaBranca.png',
  '/Imagem/CamisaBranca/17.png',
  '/Imagem/CamisaBranca/18.png',
  '/Imagem/CamisaBranca/19.png',
],
    price: '69,90',
    pricePix: '66,40',
  },
  {
    id: 5,
    name: 'Camisa GuetoSL - Preta',
    image: '/Imagem/CamisaPreta/CamisaPreta.png',
images: [
  '/Imagem/CamisaPreta/CamisaPreta.png',
  '/Imagem/CamisaPreta/21.png',
  '/Imagem/CamisaPreta/22.png',
  '/Imagem/CamisaPreta/23.png',
],
    price: '69,90',
    pricePix: '66,40',
  },
  {
    id: 6,
    name: 'Camisa GuetoSL - Cinza',
    image: '/Imagem/CamisaCinza/CamisaCinza.png',
images: [
  '/Imagem/CamisaCinza/CamisaCinza.png',
  '/Imagem/CamisaCinza/25.png',
  '/Imagem/CamisaCinza/26.png',
  '/Imagem/CamisaCinza/27.png',
],
    price: '69,90',
    pricePix: '66,40',
  },
  {
    id: 7,
    name: 'Bermuda Moletom - Branca',
    image: '/Imagem/BermudaBranca/BermudaBranca.png',
images: [
  '/Imagem/BermudaBranca/BermudaBranca.png',
  '/Imagem/BermudaBranca/29.png',
  '/Imagem/BermudaBranca/30.png',
  '/Imagem/BermudaBranca/31.png',
],
    price: '119,90',
    pricePix: '113,90',
    installment: '30,00',
  },
  {
    id: 8,
    name: 'Bermuda Moletom - Preta',
    image: '/Imagem/BermudaPreta/BermudaPreta.png',
images: [
  '/Imagem/BermudaPreta/BermudaPreta.png',
  '/Imagem/BermudaPreta/33.png',
  '/Imagem/BermudaPreta/34.png',
  '/Imagem/BermudaPreta/35.png',
],
    price: '119,90',
    pricePix: '113,90',
    installment: '30,00',
  },
  {
    id: 9,
    name: 'Bermuda Moletom - Cinza',
    image: '/Imagem/BermudaCinza/BermudaCinza.png',
images: [
  '/Imagem/BermudaCinza/BermudaCinza.png',
  '/Imagem/BermudaCinza/37.png',
  '/Imagem/BermudaCinza/38.png',
  '/Imagem/BermudaCinza/39.png',
],
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
