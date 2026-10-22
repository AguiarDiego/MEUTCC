
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { buscarProdutoPorId } from '../../service/produtoService.js';
import { staticProducts, parsePrice } from '../../data/products.js';

const IMAGENS_URL = 'http://localhost:8080/imagens';
const TAMANHOS = ['P', 'M', 'G', 'GG'];

function formatarPreco(valor) {
  const numero = Number(valor);

  if (!Number.isFinite(numero)) {
    return '0,00';
  }

  return numero.toFixed(2).replace('.', ',');
}

function obterUrlImagem(imagem) {
  const caminho =
    typeof imagem === 'string'
      ? imagem
      : imagem?.caminho || imagem?.url || imagem?.nomeArquivo || '';

  if (!caminho) return '';

  if (
    caminho.startsWith('http://') ||
    caminho.startsWith('https://') ||
    caminho.startsWith('/Imagem/')
  ) {
    return caminho;
  }

  return `${IMAGENS_URL}/${caminho.replace(/^\/+/, '')}`;
}

export default function TelaProduto() {
  const { id } = useParams();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [tamanho, setTamanho] = useState('M');
  const [quantidade, setQuantidade] = useState(1);
  const [imagens, setImagens] = useState([]);
  const [cep, setCep] = useState('');
  const [freteMsg, setFreteMsg] = useState('');
  const [frete, setFrete] = useState(null);
  const [calculandoFrete, setCalculandoFrete] = useState(false);
  const [adicionado, setAdicionado] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function carregarProduto() {
      setLoading(true);
      setError('');
      setProduct(null);
      setImagens([]);
      setQuantidade(1);
      setTamanho('M');
      setAdicionado(false);
      setFreteMsg('');
      setFrete(null);

      try {
        let dados;

        // Primeiro, busca o produto pelo ID no banco de dados.
        try {
          dados = await buscarProdutoPorId(id);
        } catch (erroBusca) {
          // Se o produto não existe no banco, não usa um produto
          // estático com o mesmo ID, pois pode ser outro produto.
          if (
            erroBusca.message === 'Produto não encontrado.'
          ) {
            throw erroBusca;
          }

          // Fallback para produtos estáticos quando a API
          // não estiver disponível.
          const produtoStatico = staticProducts.find(
            (produto) => String(produto.id) === String(id)
          );

          if (!produtoStatico) {
            throw erroBusca;
          }

          const preco = parsePrice(produtoStatico.price);

          dados = {
            id: produtoStatico.id,
            nome: produtoStatico.name,
            preco,
            tamanho: 'M',
            estoque: 10,
            imagem: produtoStatico.image,
            imagens: produtoStatico.images?.length
              ? produtoStatico.images
              : [produtoStatico.image],
            produtoEstatico: true,
          };
        }

        if (controller.signal.aborted) return;

        setProduct(dados);

        if (TAMANHOS.includes(dados.tamanho)) {
          setTamanho(dados.tamanho);
        }

        const listaImagens = Array.isArray(dados.imagens)
          ? [...dados.imagens].sort(
              (a, b) =>
                (Number(a?.id) || 0) - (Number(b?.id) || 0)
            )
          : [];

        let urlsImagens = listaImagens
          .map(obterUrlImagem)
          .filter(Boolean);

        // Compatibilidade com produtos que ainda usam a imagem antiga.
        if (urlsImagens.length === 0 && dados.imagem) {
          const imagemAntiga = obterUrlImagem(dados.imagem);

          if (imagemAntiga) {
            urlsImagens = [imagemAntiga];
          }
        }

        if (!controller.signal.aborted) {
          setImagens(urlsImagens);
        }
      } catch (erro) {
        if (!controller.signal.aborted && erro.name !== 'AbortError') {
          console.error('Erro ao carregar produto:', erro);

          setError(
            erro.message === 'Produto não encontrado.'
              ? erro.message
              : 'Não foi possível carregar este produto. Tente novamente.'
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    carregarProduto();

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <p className="container my-5 text-center">
        Carregando produto...
      </p>
    );
  }

  if (error || !product) {
    return (
      <div className="container my-5 text-center">
        <h2>{error || 'Produto não encontrado'}</h2>
        <Link to="/" className="link-vinho fw-bold">
          Voltar para a loja
        </Link>
      </div>
    );
  }

  const preco = Number(product.preco) || 0;

  const item = {
    id: product.id,
    name: product.nome,
    image: imagens[0] || '/Imagem/placeholder.svg',
    price: formatarPreco(preco),
    pricePix: formatarPreco(Math.floor(preco * 0.95 * 100) / 100),
    installment: formatarPreco(preco / 4),
  };

  const estoque = Math.max(0, Number(product.estoque) || 0);
  const semEstoque = estoque <= 0;

  function selecionarImagem(index) {
    setImagens((anteriores) => {
      if (index <= 0 || index >= anteriores.length) {
        return anteriores;
      }

      const novasImagens = [...anteriores];

      [novasImagens[0], novasImagens[index]] = [
        novasImagens[index],
        novasImagens[0],
      ];

      return novasImagens;
    });
  }

  function comprar() {
    if (semEstoque || quantidade < 1 || quantidade > estoque) {
      return;
    }

    for (let i = 0; i < quantidade; i++) {
      addItem({
        id: product.id,
        nome: product.nome,
        name: product.nome,
        preco,
        price: preco,
        imagem: item.image,
        image: item.image,
        tamanho,
      });
    }

    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 2200);
  }

  async function calcularFrete() {
    const cepNumeros = cep.replace(/\D/g, '');

    if (cepNumeros.length !== 8) {
      setFrete(null);
      setFreteMsg('Digite um CEP válido com 8 números.');
      return;
    }

    setCalculandoFrete(true);
    setFrete(null);
    setFreteMsg('');

    try {
      const resposta = await fetch(
        `http://localhost:8080/frete/cotacao?cep=${cepNumeros}`
      );

      if (!resposta.ok) {
        throw new Error('Não foi possível consultar o frete.');
      }

      const dados = await resposta.json();
      const opcao = dados.find(
        (servico) => !servico.error && servico.price
      );

      if (!opcao) {
        setFreteMsg('Nenhuma opção de frete disponível para esse CEP.');
        return;
      }

      setFrete(Number(opcao.price));
      setFreteMsg('Frete calculado com sucesso!');
    } catch (erro) {
      console.error('Erro ao calcular frete:', erro);
      setFreteMsg(
        'Não foi possível calcular o frete. Verifique se o backend está funcionando.'
      );
    } finally {
      setCalculandoFrete(false);
    }
  }

  return (
    <div className="container my-5">
      <div className="row align-items-start">
        {/* Miniaturas à esquerda */}
        <div
          className="col-12 col-md-2 order-1 mt-3 mt-md-0 d-flex flex-row flex-md-column gap-2 align-items-center"
          style={{ maxWidth: '110px' }}
        >
          {imagens.slice(0, 4).map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              className="btn p-0 rounded-0 flex-shrink-0"
              onClick={() => selecionarImagem(index)}
              aria-label={`Ver imagem ${index + 1}`}
              aria-pressed={index === 0}
              style={{
                width: '90px',
                height: '90px',
                minWidth: '90px',
                padding: 0,
                opacity: index === 0 ? 1 : 0.7,
                border:
                  index === 0
                    ? '1px solid #1a1a1a'
                    : '1px solid #ddd',
                overflow: 'hidden',
                backgroundColor: '#fff',
              }}
            >
              <img
                src={src}
                alt={`${item.name} ${index + 1}`}
                style={{
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  e.currentTarget.style.visibility = 'hidden';
                }}
              />
            </button>
          ))}
        </div>

        {/* Imagem principal */}
        <div className="col-12 col-md-6 order-2 text-center">
          <div
            style={{
              width: '100%',
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={imagens[0] || '/Imagem/placeholder.svg'}
              alt={item.name}
              className="img-fluid"
              style={{
                maxWidth: '100%',
                maxHeight: '520px',
                objectFit: 'contain',
              }}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/Imagem/placeholder.svg';
              }}
            />
          </div>
        </div>

        {/* Informações do produto */}
        <div className="col-12 col-md-4 order-3 mt-4 mt-md-0">
          <h2 className="fw-bold mb-3">{item.name}</h2>

          <p className="fw-bold mb-0 fs-3">R$ {item.price}</p>
          <p className="text-muted mb-3">
            R$ {item.pricePix} com Pix
          </p>

          <p className="small text-muted mb-0">
            4x de R$ {item.installment} sem juros
          </p>

          <p className="small text-muted mb-3">
            5% de desconto{' '}
            <span className="text-dark fw-medium">
              pagando com Pix
            </span>
          </p>

          {/* Seleção de tamanho */}
          <p className="small mb-2">Tamanho: {tamanho}</p>

          <div className="d-flex gap-2 mb-4">
            {TAMANHOS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTamanho(t)}
                className="btn btn-sm"
                aria-pressed={tamanho === t}
                style={{
                  border: '1px solid #333',
                  borderRadius: 0,
                  minWidth: '34px',
                  backgroundColor:
                    tamanho === t ? '#1a1a1a' : 'transparent',
                  color: tamanho === t ? '#fff' : '#1a1a1a',
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Quantidade e compra */}
          <div className="d-flex gap-3 mb-4">
            <div
              className="d-flex align-items-center justify-content-between"
              style={{
                border: '1px solid #333',
                width: '110px',
              }}
            >
              <button
                type="button"
                className="btn btn-sm fw-bold"
                aria-label="Diminuir quantidade"
                disabled={quantidade <= 1}
                onClick={() =>
                  setQuantidade((q) => Math.max(1, q - 1))
                }
              >
                −
              </button>

              <span className="small">{quantidade}</span>

              <button
                type="button"
                className="btn btn-sm fw-bold"
                aria-label="Aumentar quantidade"
                disabled={quantidade >= estoque}
                onClick={() =>
                  setQuantidade((q) => Math.min(estoque, q + 1))
                }
              >
                +
              </button>
            </div>

            <button
              type="button"
              className="btn-buy flex-grow-1"
              style={{ padding: '8px' }}
              disabled={semEstoque}
              onClick={comprar}
            >
              {semEstoque
                ? 'Esgotado'
                : adicionado
                ? 'Adicionado ✓'
                : 'Comprar'}
            </button>
          </div>

          {/* Consulta de frete */}
          <p className="small fw-medium mb-1">Calcular frete:</p>

          <div
            className="d-flex align-items-center mb-1"
            style={{ border: '2px solid #000' }}
          >
            <input
              type="text"
              className="form-control border-0"
              placeholder="Seu CEP"
              maxLength={9}
              value={cep}
              onChange={(e) => {
                const valor = e.target.value
                  .replace(/\D/g, '')
                  .slice(0, 8);

                setCep(
                  valor.length > 5
                    ? `${valor.slice(0, 5)}-${valor.slice(5)}`
                    : valor
                );

                setFreteMsg('');
              }}
            />

            <button
              type="button"
              className="btn btn-sm fw-bold px-3"
              onClick={calcularFrete}
              disabled={calculandoFrete}
            >
              {calculandoFrete ? 'Calculando...' : 'Calcular'}
            </button>
          </div>

          {freteMsg && (
            <p className="small text-muted mt-2 mb-0" role="status">
              {freteMsg}
            </p>
          )}

          {frete !== null && (
            <p className="small mt-2 mb-0" role="status">
              Frete: R$ {frete.toFixed(2).replace('.', ',')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
