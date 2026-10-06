
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { totalCount } = useCart();

  return (
    <>
      <div
        className="text-center text-white py-2"
        style={{ backgroundColor: 'var(--primary-color)', fontSize: '0.9rem' }}
      >
        CUPOM DE 10% NA PRIMEIRA COMPRA: <strong>GUETOSL10</strong>
      </div>

      <nav className="navbar navbar-expand-lg navbar-dark py-3" style={{ backgroundColor: '#000' }}>
        <div className="container position-relative d-flex justify-content-center">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img
              src="/Imagem/logo.png"
              alt="GuetoSL"
              style={{
                height: '48px',
                backgroundColor: '#fff',
                borderRadius: '6px',
                padding: '4px 10px',
              }}
            />
          </Link>

          <div
            className="user-actions d-flex align-items-center gap-3 position-absolute top-50 end-0 translate-middle-y"
          >
            <Link to="/login" className="d-flex align-items-center gap-1 text-white text-decoration-none">
              <i className="bi bi-person"></i>
              <span className="d-none d-md-inline">Login</span>
            </Link>
            <Link to="/carrinho" className="d-flex align-items-center gap-1 text-white text-decoration-none">
              <i className="bi bi-bag"></i>
              <span className="d-none d-md-inline">Carrinho</span>
              <span
                className="badge rounded-pill ms-1"
                style={{ backgroundColor: 'var(--badge-color)' }}
              >
                {totalCount}
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <nav className="navbar navbar-expand-lg navbar-dark py-2" style={{ backgroundColor: '#000', borderTop: '1px solid #333' }}>
        <div className="container">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainMenu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="mainMenu">
            <ul className="navbar-nav mx-auto gap-lg-5 text-center">
              <li className="nav-item">
                <Link className="nav-link fw-medium" to="/">
                  COLEÇÃO
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-medium" to="/contato">
                  CONTATO
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-medium" to="/carrinho">
                  CARRINHO
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
