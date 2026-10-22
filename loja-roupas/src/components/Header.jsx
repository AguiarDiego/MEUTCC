
import { useState, useEffect } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { totalCount } = useCart();
  const location = useLocation();
const navigate = useNavigate();
const [searchParams] = useSearchParams();
const [pesquisa, setPesquisa] = useState(
  searchParams.get('busca') || ''
);

useEffect(() => {
  setPesquisa(searchParams.get('busca') || '');
}, [searchParams]);

function pesquisarProdutos(e) {
  e.preventDefault();

  const termo = pesquisa.trim();

  navigate(
    termo ? `/?busca=${encodeURIComponent(termo)}` : '/'
  );
}
  const [clienteLogado, setClienteLogado] = useState(null);
  const [equipeLogada, setEquipeLogada] = useState(false);

  useEffect(() => {
    function atualizarCliente() {
      const clienteSalvo = sessionStorage.getItem('clienteLogado');
      const equipeSalva = localStorage.getItem('equipeLogada') === 'true';
      setEquipeLogada(equipeSalva);

      try {
        setClienteLogado(clienteSalvo ? JSON.parse(clienteSalvo) : null);
      } catch {
        setClienteLogado(null);
      }
    }

    atualizarCliente();

    window.addEventListener('clienteLogadoAtualizado', atualizarCliente);
    window.addEventListener('equipeLogadaAtualizada', atualizarCliente);

  return () => {
    window.removeEventListener('clienteLogadoAtualizado', atualizarCliente);
    window.removeEventListener('equipeLogadaAtualizada', atualizarCliente);
};
  }, []);

  return (
    <>
      <div
        className="text-center text-white py-2"
        style={{ backgroundColor: 'var(--primary-color)', fontSize: '0.9rem' }}
      >
        CUPOM DE 10% NA PRIMEIRA COMPRA: <strong>GUETOSL10</strong>
      </div>

      <nav
        className="navbar navbar-expand-lg navbar-dark"
        style={{ backgroundColor: '#000', height: '70px' }}
      >
        <div className="container position-relative d-flex justify-content-center">
          {location.pathname === '/' && (
  <form
    onSubmit={pesquisarProdutos}
    className="position-absolute start-0 top-50 translate-middle-y d-none d-md-flex"
    role="search"
    style={{ width: '250px', zIndex: 2 }}
  >
    <div className="input-group">
      <input
        type="search"
        className="form-control"
        placeholder="Pesquisar produtos..."
        aria-label="Pesquisar produtos"
        value={pesquisa}
        onChange={(e) => setPesquisa(e.target.value)}
      />

      <button
        type="submit"
        className="btn btn-outline-light"
        aria-label="Buscar"
      >
        <i className="bi bi-search"></i>
      </button>
    </div>
  </form>
)}
          <Link
            to="/"
            className="navbar-brand position-absolute start-50"
            style={{
              top: '50%',
              transform: 'translate(-50%, -50%)',
              margin: 0,
            }}
          >
            <img
              src="/Imagem/logo.png"
              alt="GuetoSL"
              style={{ height: '177px', width: 'auto', objectFit: 'contain' }}
            />
          </Link>

          <div className="user-actions d-flex align-items-center gap-3 position-absolute top-50 end-0 translate-middle-y">
            <Link
          to={
              equipeLogada
              ? '/contaequipe'
              : clienteLogado
              ? '/contausuario'
              : '/login'
          }
              className="d-flex align-items-center gap-1 text-white text-decoration-none"
            >
          <i className="bi bi-person"></i>
          <span className="d-none d-md-inline">
          {equipeLogada || clienteLogado ? 'Minha Conta' : 'Login'}
          </span>
            </Link>

            <Link
              to="/carrinho"
              className="d-flex align-items-center gap-1 text-white text-decoration-none"
            >
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

      <nav
        className="navbar navbar-expand-lg navbar-dark py-2"
        style={{ backgroundColor: '#000', borderTop: '1px solid #333' }}
      >
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
                <Link className="nav-link fw-medium" to="/">COLEÇÃO</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-medium" to="/contato">CONTATO</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-medium" to="/sobrenos">SOBRE NÓS</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
