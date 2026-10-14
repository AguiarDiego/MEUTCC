import { Link, useNavigate } from 'react-router-dom';

// Dados fake do cliente. Na quinta isso vem da API.
const usuario = {
  nome: 'Nome do Cliente',
  email: 'cliente@email.com',
  documento: '000.000.000-00',
  telefone: '+55 11 90000-0000',
};

// Lista vazia = cliente sem pedidos. Para testar o outro estado,
// coloque itens aqui, por exemplo: [{ id: 1, data: '10/10/2026', total: '119,90', status: 'Enviado' }]
const pedidos = [];

export default function ContaUsuario() {
  const navigate = useNavigate();

  

function sair() {
  sessionStorage.removeItem('clienteLogado');
  window.dispatchEvent(new Event('clienteLogadoAtualizado'));
  navigate('/login');
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
                onClick={() => alert('Editar dados pessoais - funcionalidade a implementar')}
              >
                Editar
              </button>
            </div>

            <p className="mb-5 small">
              <strong>{usuario.nome}</strong>
              <br />
              {usuario.email}
              <br />
              <strong>CPF / CNPJ:</strong> {usuario.documento}
              <br />
              <strong>Telefone:</strong> {usuario.telefone}
            </p>

            <button type="button" onClick={sair} className="btn btn-dark px-4">
              Sair
            </button>
          </div>
        </div>

        {/* Coluna direita: pedidos */}
        <div className="col-md-6 text-center">
          <h4 className="mb-4">Meus pedidos</h4>

          {pedidos.length === 0 ? (
            <>
              <p className="mb-1">Você ainda não realizou nenhum pedido.</p>
              <p className="fw-bold mb-3">Faça sua primeira compra!</p>

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
              {pedidos.map((pedido) => (
                <div key={pedido.id} className="card border-0 shadow-sm mb-3">
                  <div className="card-body">
                    <h6 className="mb-1">Pedido #{pedido.id}</h6>
                    <p className="small mb-1">Data: {pedido.data}</p>
                    <p className="small mb-1">Total: R${pedido.total}</p>
                    <p className="small mb-0">Status: {pedido.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}