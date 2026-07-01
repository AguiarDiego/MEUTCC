import { useState } from 'react';
import { staticProducts } from '../data/products.js';
import { useCart } from '../context/CartContext';

export default function Home() {
  const [justAdded, setJustAdded] = useState('');
  const { addItem } = useCart();

  function handleAdd(product) {
    addItem(product);
    setJustAdded(product.name);
    window.clearTimeout(handleAdd._t);
    handleAdd._t = window.setTimeout(() => setJustAdded(''), 2200);
  }

  return (
    <main>
      <section className="py-5" style={{ backgroundColor: 'var(--secondary-color)' }}>
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4 mb-4 mb-md-0">
              <i className="bi bi-truck fs-3 mb-2 d-block"></i>
              <h5>FRETE GRÁTIS</h5>
              <p className="text-muted mb-0">Para compras acima de R$238,90</p>
            </div>
            <div className="col-md-4 mb-4 mb-md-0">
              <i className="bi bi-percent fs-3 mb-2 d-block"></i>
              <h5>10% OFF NA PRIMEIRA COMPRA</h5>
              <p className="text-muted mb-0">Use o cupom "GUETOSL10"</p>
            </div>
            <div className="col-md-4">
              <i className="bi bi-credit-card fs-3 mb-2 d-block"></i>
              <h5>ATÉ 4X SEM JUROS</h5>
              <p className="text-muted mb-0">Em todo site</p>
            </div>
          </div>
        </div>
      </section>

      <section id="colecao" className="container my-5">
        <h2 className="section-title">DISPONÍVEL AGORA</h2>

        <div className="row">
          {staticProducts.map((product) => (
            <div className="col-md-4" key={product.id}>
              <div className="card border-0 shadow-sm mb-4 h-100 product-card">
                <img
                  src={product.image}
                  className="card-img-top"
                  alt={product.name}
                  style={{ height: '340px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.src = '/Imagem/placeholder.svg';
                  }}
                />
                <div className="card-body text-center d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="fw-bold mb-0">R${product.price}</p>
                  <p className="mb-0" style={{ color: 'var(--accent-color)' }}>
                    R${product.pricePix} com Pix
                  </p>
                  <p className="text-muted small">
                    4x de R${product.installment} sem juros
                  </p>
                  <button
                    type="button"
                    className="btn btn-dark mt-auto w-100"
                    onClick={() => handleAdd(product)}
                  >
                    Comprar <i className="bi bi-cart-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div
        className={`position-fixed bottom-0 start-50 translate-middle-x mb-4 px-4 py-2 text-white rounded ${
          justAdded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundColor: 'var(--primary-color)',
          transition: 'opacity 0.25s ease',
          zIndex: 1050,
          pointerEvents: 'none',
        }}
        role="status"
      >
        {justAdded && `${justAdded} adicionado ao carrinho`}
      </div>
    </main>
  );
}
