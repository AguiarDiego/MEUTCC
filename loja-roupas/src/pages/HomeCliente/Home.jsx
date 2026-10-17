
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { staticProducts } from '../../data/products.js';
import { listarProdutos } from '../../service/produtoService.js';
import { useCart } from '../../context/CartContext';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [erro, setErro] = useState(false);
  const [justAdded, setJustAdded] = useState('');

  const { addItem } = useCart();

  useEffect(() => {
    let ativo = true;

    async function carregarProdutos() {
      try {
       const produtosDoBanco = await listarProdutos();

        if (produtosDoBanco.length === 0) {
          setProducts(staticProducts);
          setErro(false);
        return;
        }

        if (!Array.isArray(produtosDoBanco)) {
          throw new Error('A resposta da API não é uma lista de produtos.');
        }

        const produtosFormatados = produtosDoBanco.map((produto) => {
          const produtoVisual = staticProducts.find(
            (produtoStatico) =>
              String(produtoStatico.id) === String(produto.id)
          );

          // Obtém as imagens do produto e ordena pelo ID.
          const imagensOrdenadas = [...(produto.imagens || [])].sort(
            (a, b) => a.id - b.id
          );

          const imagem = imagensOrdenadas[0];

          const nomeImagem =
            typeof imagem === 'string'
              ? imagem
              : imagem?.caminho || imagem?.url || imagem?.nomeArquivo;

          const imagemBackend = nomeImagem
            ? nomeImagem.startsWith('http://') ||
              nomeImagem.startsWith('https://')
              ? nomeImagem
              : `http://localhost:8080/imagens/${nomeImagem.replace(/^\/+/, '')}`
            : null;

          const precoNormal = Number(
            String(produto.preco ?? 0).replace(',', '.')
          );

          const precoValido = Number.isFinite(precoNormal)
            ? precoNormal
            : 0;

          return {
            id: produto.id,
            name: produto.nome ?? produtoVisual?.name ?? 'Produto',
            price: precoValido.toFixed(2).replace('.', ','),
            pricePix: (
              Math.floor(precoValido * 0.95 * 100) / 100
            ).toFixed(2).replace('.', ','),
            installment: (precoValido / 4)
              .toFixed(2)
              .replace('.', ','),

            image:
              imagemBackend ||
              produtoVisual?.image ||
              '/Imagem/placeholder.svg',

            descricao: produto.descricao,
            tamanho: produto.tamanho,
            cor: produto.cor,
            estoque: produto.estoque,
            categoria: produto.categoria,

            // Mantém o preço numérico para operações do carrinho.
            precoNumerico: precoValido,
          };
        });

        if (ativo) {
          setProducts(produtosFormatados);
          setErro(false);
        }
      } catch (erroCarregamento) {
  console.error('Erro ao carregar produtos:', erroCarregamento);

  if (ativo) {
    setProducts(staticProducts);
    setErro(false);
  }
}
    }

    carregarProdutos();

    return () => {
      ativo = false;
    };
  }, []);

  function handleAdd(product) {
    addItem({
      id: product.id,
      nome: product.name,
      name: product.name,
      preco: product.precoNumerico,
      price: product.precoNumerico,
      imagem: product.image,
      image: product.image,
      descricao: product.descricao,
      tamanho: product.tamanho,
      cor: product.cor,
    });

    setJustAdded(product.name);

    window.clearTimeout(handleAdd.timer);

    handleAdd.timer = window.setTimeout(() => {
      setJustAdded('');
    }, 2200);
  }

  return (
    <main>
      <section
        className="py-5"
        style={{ backgroundColor: 'var(--secondary-color)' }}
      >
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4 mb-4 mb-md-0">
              <i className="bi bi-truck fs-3 mb-2 d-block"></i>
              <h5>FRETE GRÁTIS</h5>
              <p className="text-muted mb-0">
                Para compras acima de R$238,90
              </p>
            </div>

            <div className="col-md-4 mb-4 mb-md-0">
              <i className="bi bi-percent fs-3 mb-2 d-block"></i>
              <h5>10% OFF NA PRIMEIRA COMPRA</h5>
              <p className="text-muted mb-0">
                Use o cupom "GUETOSL10"
              </p>
            </div>

            <div className="col-md-4">
              <i className="bi bi-credit-card fs-3 mb-2 d-block"></i>
              <h5>ATÉ 4X SEM JUROS</h5>
              <p className="text-muted mb-0">
                Em todo site
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="colecao" className="container my-3">
        <h2 className="section-title my-5">
          DISPONÍVEL AGORA
        </h2>

        {erro && (
          <div className="alert alert-danger" role="alert">
            Não foi possível carregar os produtos. Confira se o
            backend está funcionando e tente novamente.
          </div>
        )}

        {!erro && products.length === 0 && (
          <p className="text-muted text-center my-5">
            Nenhum produto disponível no momento.
          </p>
        )}

        <div className="row">
          {products.map((product) => (
            <div
              className="col-md-4 my-4"
              key={product.id}
            >
              <div className="card border-0 shadow-sm mb-4 h-100 product-card">
                <Link to={`/produto/${product.id}`}>
                  <img
                    src={product.image}
                    className="card-img-top"
                    alt={product.name}
                    style={{
                      height: '340px',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/Imagem/placeholder.svg';
                    }}
                  />
                </Link>

                <div className="card-body text-center d-flex flex-column">
                  <Link
                    to={`/produto/${product.id}`}
                    className="text-dark text-decoration-none"
                  >
                    <h5 className="card-title">
                      {product.name}
                    </h5>
                  </Link>

                  <p className="fw-bold mb-0">
                    R${product.price}
                  </p>

                  <p
                    className="mb-0"
                    style={{ color: 'var(--accent-color)' }}
                  >
                    R${product.pricePix} com Pix
                  </p>

                  <p className="mb-2">
                    ou 4x de R${product.installment} sem juros
                  </p>

                  <button
                    type="button"
                    className="btn btn-dark mt-auto w-100"
                    onClick={() => handleAdd(product)}
                  >
                    Comprar{' '}
                    <i className="bi bi-cart-plus"></i>
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
        aria-live="polite"
      >
        {justAdded && `${justAdded} adicionado ao carrinho`}
      </div>
    </main>
  );
}
