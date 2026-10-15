import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, parsePrice } from '../../data/products.js';
import { useCart } from '../../context/CartContext';
import '../Carrinho/Cart.css';

export default function Cart() {
  const { items, removeItem, setQty } = useCart();
  const [cep, setCep] = useState('');
  const [frete, setFrete] = useState(null);
  const [calculandoFrete, setCalculandoFrete] = useState(false);

  
async function calcularFrete() {
  const cepLimpo = cep.replace(/\D/g, '');

  if (cepLimpo.length !== 8) {
    alert('Digite um CEP válido com 8 números.');
    return;
  }

  setCalculandoFrete(true);
  setFrete(null);

  try {
    const resposta = await fetch(
      `http://localhost:8080/frete/cotacao?cep=${cepLimpo}`
    );

    if (!resposta.ok) {
      throw new Error('Não foi possível consultar o frete.');
    }

    const dados = await resposta.json();
    const opcao = dados.find(
      (servico) => !servico.error && servico.price
    );

    if (!opcao) {
      alert('Nenhuma opção de frete disponível para esse CEP.');
      return;
    }

    setFrete(Number(opcao.price));
  } catch (erro) {
    console.error('Erro ao calcular frete:', erro);
    alert('Não foi possível calcular o frete. Verifique se o backend está funcionando.');
  } finally {
    setCalculandoFrete(false);
  }
}


  const lines = items.filter((item) => item.product);

  const subtotal = lines.reduce(
    (sum, item) =>
      sum + parsePrice(item.product.price) * item.qty,
    0
  );

  const shipping = subtotal === 0 ? 0 : frete ?? 0;
  const total = subtotal + shipping;

  if (lines.length === 0) {
    return (
      <main className="cart cart--empty">
        <h1>Carrinho</h1>
        <p>Seu carrinho está vazio, por enquanto.</p>

        <Link to="/" className="fw-bold link-vinho">
          Ver coleção
        </Link>
      </main>
    );
  }

  return (
    <main className="cart">
      <h1>Carrinho</h1>

      <div className="cart__layout">
        <ul className="cart__list">
          {lines.map(({ product, qty }) => (
            <li key={product.id} className="cart__line">
              <img
                src={product.image || '/Imagem/placeholder.svg'}
                alt={product.name}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = '/Imagem/placeholder.svg';
                }}
              />

              <div className="cart__line-info">
                <div>
                  <h3>{product.name}</h3>
                </div>

                <div className="cart__line-controls">
                  <div className="cart__qty">
                    <button
                      type="button"
                      onClick={() => setQty(product.id, qty - 1)}
                      aria-label={`Diminuir quantidade de ${product.name}`}
                    >
                      –
                    </button>

                    <span>{qty}</span>

                    <button
                      type="button"
                      onClick={() => setQty(product.id, qty + 1)}
                      aria-label={`Aumentar quantidade de ${product.name}`}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    className="cart__remove"
                    onClick={() => removeItem(product.id)}
                  >
                    Remover
                  </button>
                </div>
              </div>

              <span className="cart__line-price">
                {formatPrice(parsePrice(product.price) * qty)}
              </span>
            </li>
          ))}
        </ul>

        <aside className="cart__summary">
          <h2>Resumo</h2>

          <div className="cart__shipping">
            <label htmlFor="cep">Calcular frete pelo CEP</label>

            <input
              id="cep"
              type="text"
              value={cep}
              onChange={(event) => {
                const valor = event.target.value
                  .replace(/\D/g, '')
                  .slice(0, 8);

                setCep(valor);
                setFrete(null);
              }}
              placeholder="Digite seu CEP"
              maxLength={8}
              inputMode="numeric"
            />

            <button
              type="button"
              onClick={calcularFrete}
              disabled={calculandoFrete}
            >
              {calculandoFrete ? 'Calculando...' : 'Calcular frete'}
            </button>
          </div>

          
          <div className="cart__summary-row">
            <span>Frete</span>
          <span>
            {frete === null
            ? 'Calcule o frete'
            : frete === 0
            ? 'Grátis'
            : formatPrice(frete)}
          </span>
          </div>


          <div className="cart__summary-row">
            <span>Frete</span>
            <span>
              {shipping === 0 ? 'Grátis' : formatPrice(shipping)}
            </span>
          </div>

          {shipping > 0 && (
            <p className="cart__summary-note">
              Frete grátis a partir de R$238,90.
            </p>
          )}

          <div className="cart__summary-row cart__summary-row--total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <button type="button" className="cart__checkout">
            Finalizar compra
          </button>
        </aside>
      </div>
    </main>
  );
}