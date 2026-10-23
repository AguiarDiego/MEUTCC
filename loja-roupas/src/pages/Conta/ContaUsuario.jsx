import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ContaUsuario() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [carregandoPedidos, setCarregandoPedidos] = useState(true);
  const [erroPedidos, setErroPedidos] = useState('');
  const [pedidoAberto, setPedidoAberto] = useState(null);

  const clienteSalvo = sessionStorage.getItem('clienteLogado');
  const usuario = clienteSalvo ? JSON.parse(clienteSalvo) : null;
  useEffect(() => {
    if (!usuario?.id) {
      setPedidos([]);
      setCarregandoPedidos(false);
      return;
    }

    async function buscarPedidos() {
      try {
        setCarregandoPedidos(true);
        setErroPedidos('');

        const resposta = await fetch(
          `http://localhost:8080/pedidos/cliente/${usuario.id}`
        );

        if (!resposta.ok) {
          throw new Error('Não foi possível carregar os pedidos.');
        }

        const dados = await resposta.json();
        setPedidos(dados);
      } catch (erro) {
        console.error(erro);
        setErroPedidos('Não foi possível carregar seus pedidos.');
      } finally {
        setCarregandoPedidos(false);
      }
    }

    buscarPedidos();
  }, [usuario?.id]);

  function sair() {
    sessionStorage.removeItem('clienteLogado');
    window.dispatchEvent(new Event('clienteLogadoAtualizado'));
    navigate('/login');
  }

  if (!usuario) {
    navigate('/login');
    return null;
  }

  return (
    <div className="container my-5">
      <p className="text-center text-muted mb-2">
        <Link to="/" className="text-muted">
          Início
        </Link>
        {' . '}
        <span>Minha conta</span>
      </p>

      <h2 className="text-center mb-5">Minha conta</h2>

      <div className="row">
        {/* Coluna esquerda: dados pessoais */}
        <div className="col-md-6 border-end mb-5 mb-md-0">
          <div className="mx-auto" style={{ maxWidth: '320px' }}>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h6 className="fw-bold mb-0">Dados Pessoais</h6>

              <button
                type="button"
                className="btn btn-link p-0 small"
                style={{ color: 'var(--primary-color)' }}
                onClick={() =>
                  alert('Editar dados pessoais - funcionalidade a implementar')
                }
              >
                Editar
              </button>
            </div>

            <p className="mb-5 small">
              <strong>Nome:</strong> {usuario.nome}
              <br />
              <strong>Email:</strong> {usuario.email}
              <br />
              <strong>Telefone:</strong> {usuario.telefone}
            </p>

            <button
              type="button"
              onClick={sair}
              className="btn btn-dark px-4"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Coluna direita: pedidos */}
        <div className="col-md-6 text-center">
          <h4 className="mb-4">Meus pedidos</h4>

{carregandoPedidos ? (
  <p className="text-muted">Carregando seus pedidos...</p>
) : erroPedidos ? (
  <p className="text-danger">{erroPedidos}</p>
) : pedidos.length === 0 ? (
  <>
    <p className="mb-1">
      Você ainda não realizou nenhum pedido.
    </p>
    <p className="fw-bold mb-3">
      Faça sua primeira compra!
    </p>

    <Link
      to="/"
      className="btn-buy d-inline-block text-center text-decoration-none"
      style={{ padding: '10px 24px' }}
    >
      Ir para a loja
    </Link>
  </>
) : (
  <div className="text-start mx-auto" style={{ maxWidth: '400px' }}>
{pedidos.map((pedido) => {
  const aberto = pedidoAberto === pedido.id;

  return (
    <div
      key={pedido.id}
      className="card border-0 shadow-sm mb-3"
    >
      <button
        type="button"
        className="card-body d-flex justify-content-between align-items-center text-start w-100 border-0 bg-white"
        onClick={() =>
          setPedidoAberto(aberto ? null : pedido.id)
        }
        aria-expanded={aberto}
        style={{ cursor: 'pointer' }}
      >
        <div>
          <h6 className="mb-1">Pedido #{pedido.id}</h6>
          <p className="small text-muted mb-0">
            {pedido.dataPedido
              ? new Date(pedido.dataPedido).toLocaleDateString('pt-BR')
              : 'Data não informada'}
          </p>
        </div>

        <span className="d-flex align-items-center gap-2">
          <span className="small">{pedido.situacao}</span>
          <i
            className={`bi ${aberto ? 'bi-chevron-up' : 'bi-chevron-down'}`}
          />
        </span>
      </button>

      {aberto && (
        <div className="card-body border-top text-start">
          <p className="small mb-2">
            <strong>Número do pedido:</strong> #{pedido.id}
          </p>

          <p className="small mb-2">
            <strong>Data:</strong>{' '}
            {pedido.dataPedido
              ? new Date(pedido.dataPedido).toLocaleString('pt-BR')
              : 'Não informada'}
          </p>

          <p className="small mb-0">
            <strong>Situação:</strong> {pedido.situacao}
          </p>
        </div>
      )}
    </div>
  );
})}
  </div>
)}

        </div>
      </div>
    </div>
  );
}
