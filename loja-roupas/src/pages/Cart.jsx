import { Link } from 'react-router-dom';
import { staticProducts, formatPrice, parsePrice } from '../data/products';
import { useCart } from '../context/CartContext';
import './Cart.css';

export default function Cart() {
  const { items, removeItem, setQty } = useCart();

  const lines = items
    .map((i) => ({
      ...i,
      product: staticProducts.find((p) => p.id === i.id),
    }))
    .filter((l) => l.product);

  const subtotal = lines.reduce(
    (sum, l) => sum + parsePrice(l.product.price) * l.qty,
    0
  );
  const shipping = subtotal === 0 ? 0 : subtotal >= 238.9 ? 0 : 19.9;
  const total = subtotal + shipping;

  if (lines.length === 0) {
    return (
      <main className="cart cart--empty">
        <h1>Carrinho</h1>
        <p>Seu carrinho está vazio, por enquanto.</p>
        <Link to="/" className="cart__cta">
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
              <img src={product.image} alt={product.name} />
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
          <div className="cart__summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="cart__summary-row">
            <span>Frete</span>
            <span>{shipping === 0 ? 'Grátis' : formatPrice(shipping)}</span>
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
