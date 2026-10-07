import { useState } from 'react';
import { Link } from 'react-router-dom';
import PainelPedidos from '../../components/PainelPedidos';
import { staticProducts } from '../../data/products.js';

export default function ContaEquipe() {
  const [produtos, setProdutos] = useState(staticProducts);

  function excluirProduto(id) {
    // Por enquanto só remove da tela. Quando a API estiver pronta,
    // isso vira uma chamada DELETE para o backend.
    setProdutos((prev) => prev.filter((produto) => produto.id !== id));
  }

  function editarProduto(id) {
    // Placeholder - aqui no futuro abre um formulário/modal de edição
    alert(`Editar produto #${id} - funcionalidade a implementar`);
  }

  function adicionarItem() {
    // Placeholder - aqui no futuro abre um formulário de novo produto
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
        {/* Coluna esquerda: painel de pedidos */}
        <div className="col-md-6 border-end">
          <PainelPedidos />
        </div>

        {/* Coluna direita: editar itens da loja */}
        <div className="col-md-6 ps-md-4">
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