import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { staticProducts } from '../../data/products.js';

// Dados fake do membro da equipe. Na quinta isso vem da API.
const equipe = {
  nome: 'Nome do Responsável',
  email: 'equipe@guetosl.com',
  documento: '000.000.000-00',
  telefone: '+55 11 90000-0000',
  endereco: {
    rua: 'R. Exemplo, 123',
    bairro: 'Bairro, Cidade, 00000-000',
    estado: 'São Paulo',
    pais: 'Brasil',
  },
};

export default function ContaEquipe() {
  const [produtos, setProdutos] = useState(staticProducts);
  const navigate = useNavigate();

  function sair() {
    navigate('/loginequipe');
  }

  function excluirProduto(id) {
    setProdutos((prev) => prev.filter((produto) => produto.id !== id));
  }

  function editarProduto(id) {
    alert(`Editar produto #${id} - funcionalidade a implementar`);
  }

  function adicionarItem() {
    alert('Adicionar novo item - funcionalidade a implementar');
  }

  return (
    <div className="container my-5">
      <p className="text-center text-muted mb-2">
        <Link to="/" className="text-muted">
          Início
        </Link>
        {' . '}
        <span>Minha conta - Equipe</span>
      </p>

      <h2 className="text-center mb-5">Minha conta - Equipe</h2>

      <div className="row">
        {/* Coluna esquerda: atalho para a página de pedidos + dados do responsável */}
        <div className="col-md-4 border-end mb-5 mb-md-0">
          <h4 className="mb-4">Pedidos</h4>
          <p className="text-muted small">
            Acompanhe pagamentos, prepare pedidos e confirme os envios.
          </p>

          <Link
            to="/gerenciarpedidos"
            className="btn-buy d-inline-block text-center text-decoration-none mb-5"
            style={{ padding: '10px 24px' }}
          >
            <i className="bi bi-box-seam me-2"></i>
            Gerenciar pedidos
          </Link>

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
          <p className="mb-4 small">
            <strong>{equipe.nome}</strong>
            <br />
            {equipe.email}
            <br />
            <strong>CPF / CNPJ:</strong> {equipe.documento}
            <br />
            <strong>Telefone:</strong> {equipe.telefone}
          </p>

          <div className="d-flex justify-content-between align-items-start mb-2">
            <h6 className="fw-bold mb-0">Meus endereços</h6>
            <button
              type="button"
              className="btn btn-link p-0 small"
              style={{ color: 'var(--primary-color)' }}
              onClick={() => alert('Editar endereço - funcionalidade a implementar')}
            >
              Editar
            </button>
          </div>
          <p className="mb-4 small">
            {equipe.endereco.rua}
            <br />
            {equipe.endereco.bairro}
            <br />
            {equipe.endereco.estado}
            <br />
            {equipe.endereco.pais}
          </p>

          <button type="button" onClick={sair} className="btn btn-dark px-4">
            Sair
          </button>
        </div>

        {/* Coluna direita: editar itens da loja */}
        <div className="col-md-8 ps-md-4">
          <h4 className="mb-4">Editar itens da loja</h4>

          <div className="row g-3">
            {produtos.map((produto) => (
              <div className="col-6 col-lg-4" key={produto.id}>
                <div className="text-center">
                  <img
                    src={produto.image}
                    alt={produto.name}
                    className="img-fluid mb-2"
                    style={{ maxHeight: '140px', objectFit: 'contain' }}
                  />
                  <p className="small fw-medium mb-1">{produto.name}</p>
                  <p className="small mb-2">R${produto.price}</p>

                  <button
                    type="button"
                    className="btn-buy d-block w-100 mb-1"
                    style={{ padding: '4px', fontSize: '0.85rem' }}
                    onClick={() => editarProduto(produto.id)}
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    className="btn btn-link p-0 small"
                    style={{ color: 'var(--badge-color)', textDecoration: 'underline' }}
                    onClick={() => excluirProduto(produto.id)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={adicionarItem}
              className="btn d-flex align-items-center justify-content-center mx-auto mb-2"
              style={{
                width: '70px',
                height: '70px',
                backgroundColor: 'var(--badge-color)',
                color: 'white',
                fontSize: '1.8rem',
              }}
            >
              +
            </button>
            <span className="small fw-medium" style={{ color: 'var(--badge-color)' }}>
              Adicionar item
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}