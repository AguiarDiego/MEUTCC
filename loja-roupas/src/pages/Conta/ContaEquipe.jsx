
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    listarProdutos,
    listarCategorias,
    cadastrarProduto,
    atualizarProduto,
    enviarImagemProduto,
    excluirProduto as excluirProdutoAPI,
} from '../../service/produtoService.js';

const membrosEquipe = {
  'arthuraugusto2@guetosl.com': {
    nome: 'Arthur da Silva Augusto',
    email: 'arthuraugusto2@guetosl.com',
    rm: '98123',
  },
  'bryanaraujo5@guetosl.com': {
    nome: 'Bryan de Araújo Ribeiro',
    email: 'bryanaraujo5@guetosl.com',
    rm: '98248',
  },
  'danielbrito6@guetosl.com': {
    nome: 'Daniel Brito Vilela',
    email: 'danielbrito6@guetosl.com',
    rm: '99075',
  },
  'diegoaguiar9@guetosl.com': {
    nome: 'Diego Lima de Aguiar',
    email: 'diegoaguiar9@guetosl.com',
    rm: '98890',
  },
  'enzogabriel13@guetosl.com': {
    nome: 'Enzo Gabriel Ferreira da Silva',
    email: 'enzogabriel13@guetosl.com',
    rm: '99084',
  },
  'gabrielfernandes19@guetosl.com': {
    nome: 'Gabriel Fernandesde Aquino',
    email: 'gabrielfernandes19@guetosl.com',
    rm: '99088',
  },
  'igorbrasil31@guetosl.com': {
    nome: 'Igor Brasil Domingues',
    email: 'igorbrasil31@guetosl.com',
    rm: '99222',
  },
};

export default function ContaEquipe() {
  /*
   * Guarda as categorias recebidas do backend.
   */
  const [categorias, setCategorias] = useState([]);

  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // Estados das mensagens de contato.
  const [mensagens, setMensagens] = useState([]);
  const [carregandoMensagens, setCarregandoMensagens] = useState(true);
  const [erroMensagens, setErroMensagens] = useState('');

  const navigate = useNavigate();
  const emailEquipe = localStorage.getItem('emailEquipe');
  const equipe = membrosEquipe[emailEquipe];

  useEffect(() => {
    if (
      localStorage.getItem('equipeLogada') !== 'true' ||
      !equipe
    ) {
      navigate('/loginequipe', { replace: true });
    }
  }, [navigate, equipe]);

  // Controla se o formulário de cadastro está visível.
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Guarda o ID do produto que estamos editando.
  const [produtoEditandoId, setProdutoEditandoId] = useState(null);

  // Guarda os valores digitados no formulário.
  const [novoProduto, setNovoProduto] = useState({
    nome: '',
    descricao: '',
    preco: '',
    tamanho: '',
    cor: '',
    categoria: '',
    estoque: '',
    imagens: [],
  });

  // Atualiza o campo que o usuário modificar.
  function alterarCampo(evento) {
    const { name, value } = evento.target;

    setNovoProduto((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  // Primeiro: carrega os produtos.
  useEffect(() => {
    async function carregarProdutos() {
      try {
        const dados = await listarProdutos();

        const produtosFormatados = dados.map((produto) => {
          const imagensOrdenadas = [...(produto.imagens || [])]
            .sort((a, b) => a.id - b.id);

          const nomeImagem = imagensOrdenadas[0]?.caminho;

          const imagemBackend = nomeImagem
            ? `http://localhost:8080/imagens/${nomeImagem}`
            : '/Imagem/placeholder.svg';

          return {
            ...produto,
            name: produto.nome,
            price: Number(produto.preco),
            image: imagemBackend,
          };
        });

        setProdutos(produtosFormatados);
      } catch (erro) {
        console.error('Erro ao carregar produtos:', erro);
        setErro('Não foi possível carregar os produtos.');
      } finally {
        setCarregando(false);
      }
    }

    carregarProdutos();
  }, []);

  // Segundo: carrega as categorias.
  useEffect(() => {
    async function carregarCategorias() {
      try {
        const dados = await listarCategorias();
        setCategorias(dados);
      } catch (erro) {
        console.error('Erro ao carregar categorias:', erro);
      }
    }

    carregarCategorias();
  }, []);

  // Carrega as mensagens enviadas pela página de contato.
  useEffect(() => {
    async function carregarMensagens() {
      try {
        const resposta = await fetch(
          'http://localhost:8080/contato/mensagens'
        );

        if (!resposta.ok) {
          throw new Error('Não foi possível carregar as mensagens.');
        }

        const dados = await resposta.json();
        setMensagens(dados);
      } catch (erro) {
        console.error('Erro ao carregar mensagens:', erro);
        setErroMensagens('Não foi possível carregar as mensagens.');
      } finally {
        setCarregandoMensagens(false);
      }
    }

    carregarMensagens();
  }, []);

  // Encerra a sessão da equipe.
  function sair() {
    localStorage.removeItem('equipeLogada');
    localStorage.removeItem('emailEquipe');

    window.dispatchEvent(new Event('equipeLogadaAtualizada'));

    navigate('/login', { replace: true });
  }

  // Exclui um produto.
  async function excluirProduto(id) {
    const confirmar = window.confirm(
      'Tem certeza que deseja excluir este produto?'
    );

    if (!confirmar) return;

    try {
      await excluirProdutoAPI(id);

      setProdutos((prev) =>
        prev.filter((produto) => produto.id !== id)
      );

      alert('Produto excluído com sucesso!');
    } catch (erro) {
      console.error('Erro ao excluir produto:', erro);
      alert('Não foi possível excluir o produto.');
    }
  }

  // Prepara o formulário para editar um produto.
  function editarProduto(id) {
    const produto = produtos.find((item) => item.id === id);

    if (!produto) {
      alert('Produto não encontrado.');
      return;
    }

    setProdutoEditandoId(id);

    setNovoProduto({
      nome: produto.nome ?? produto.name ?? '',
      descricao: produto.descricao ?? '',
      preco: String(produto.preco ?? produto.price ?? ''),
      tamanho: produto.tamanho ?? '',
      cor: produto.cor ?? '',
      categoria: produto.categoria?.id
        ? String(produto.categoria.id)
        : '',
      estoque: String(produto.estoque ?? ''),
      imagens: [],
    });

    setMostrarFormulario(true);
  }

  // Abre o formulário para cadastrar um produto.
  function adicionarItem() {
    setProdutoEditandoId(null);

    setNovoProduto({
      nome: '',
      descricao: '',
      preco: '',
      tamanho: '',
      cor: '',
      categoria: '',
      estoque: '',
      imagens: [],
    });

    setMostrarFormulario(true);
  }

  // Envia os dados do formulário para o backend.
  async function salvarProduto(evento) {
    evento.preventDefault();

    const estavaEditando = produtoEditandoId !== null;

    try {
      const produto = {
        nome: novoProduto.nome,
        descricao: novoProduto.descricao,
        preco: Number(novoProduto.preco),
        tamanho: novoProduto.tamanho,
        cor: novoProduto.cor,
        estoque: Number(novoProduto.estoque),
        categoria: {
          id: Number(novoProduto.categoria),
        },
      };

      let idProdutoSalvo;

      if (estavaEditando) {
        await atualizarProduto(produtoEditandoId, produto);
        idProdutoSalvo = produtoEditandoId;
      } else {
        const produtoCadastrado = await cadastrarProduto(produto);
        idProdutoSalvo = produtoCadastrado.id;
      }

      // Envia todas as imagens selecionadas, uma por vez.
      for (const arquivo of novoProduto.imagens) {
        await enviarImagemProduto(idProdutoSalvo, arquivo);
      }

      // Atualiza a lista de produtos.
      const dados = await listarProdutos();

      const produtosFormatados = dados.map((item) => {
        const imagensOrdenadas = [...(item.imagens || [])]
          .sort((a, b) => a.id - b.id);

        const nomeImagem = imagensOrdenadas[0]?.caminho;

        return {
          ...item,
          name: item.nome,
          price: Number(item.preco),
          image: nomeImagem
            ? `http://localhost:8080/imagens/${nomeImagem}`
            : '/Imagem/placeholder.svg',
        };
      });

      setProdutos(produtosFormatados);

      // Limpa o formulário.
      setNovoProduto({
        nome: '',
        descricao: '',
        preco: '',
        tamanho: '',
        cor: '',
        categoria: '',
        estoque: '',
        imagens: [],
      });

      setProdutoEditandoId(null);
      setMostrarFormulario(false);

      alert(
        estavaEditando
          ? 'Produto atualizado com sucesso!'
          : 'Produto cadastrado com sucesso!'
      );
    } catch (erro) {
      console.error('Erro ao salvar produto:', erro);

      alert(
        estavaEditando
          ? 'Não foi possível atualizar o produto.'
          : 'Não foi possível cadastrar o produto.'
      );
    }
  }

  if (
    localStorage.getItem('equipeLogada') !== 'true' ||
    !equipe
  ) {
    return null;
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
        {/* Coluna esquerda: pedidos, mensagens e dados da equipe */}
        <div className="col-md-4 border-end mb-5 mb-md-0">
          <h4 className="mb-4">Pedidos</h4>

          <p className="text-muted small">
            Acompanhe pagamentos, prepare pedidos e confirme os envios.
          </p>

          <Link
            to="/gerenciarpedidos"
            className="btn-buy d-inline-block text-center text-decoration-none mb-4"
            style={{ padding: '10px 24px' }}
          >
            <i className="bi bi-box-seam me-2"></i>
            Gerenciar pedidos
          </Link>

          <hr className="my-4" />

          {/* Mensagens de contato na coluna esquerda */}
          <section aria-labelledby="mensagens-contato">
            <h4 id="mensagens-contato" className="mb-4">
              Mensagens de contato
            </h4>

            <p className="text-muted small">
              Veja as mensagens enviadas por usuários na aba Contato.
            </p>

            <Link
              to="/mensagenscontato"
              className="btn-buy d-inline-block text-center text-decoration-none mb-4"
              style={{ padding: '10px 24px' }}
            >
              <i className="bi bi-envelope me-2"></i>
              Mensagens de contato
            </Link>
          </section>

          <hr className="my-4" />

          {/* Dados pessoais da equipe */}
          <h6 className="fw-bold mb-2">Dados Pessoais</h6>

          <p className="mb-4 small">
            <strong>Nome: </strong>{equipe.nome}
            <br />
            <strong>Email: </strong>{equipe.email}
            <br />
            <strong>RM: </strong>{equipe.rm}
          </p>

          <button
            type="button"
            onClick={sair}
            className="btn btn-dark px-4"
          >
            Sair
          </button>
        </div>

        {/* Coluna direita: edição e cadastro de produtos */}
        <div className="col-md-8 ps-md-4">
          <h4 className="mb-4">Editar itens da loja</h4>

          {carregando && <p>Carregando produtos...</p>}

          {erro && <p className="text-danger">{erro}</p>}

          {/* Lista de produtos */}
          <div className="row g-3">
            {produtos.map((produto) => (
              <div className="col-6 col-lg-4" key={produto.id}>
                <div className="text-center">
                  <img
                    src={produto.image}
                    alt={produto.name}
                    className="img-fluid mb-2"
                    style={{
                      maxHeight: '140px',
                      objectFit: 'contain',
                    }}
                  />

                  <p className="small fw-medium mb-1">
                    {produto.name}
                  </p>

                  <p className="small mb-2">
                    R${produto.price}
                  </p>

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
                    style={{
                      color: 'var(--badge-color)',
                      textDecoration: 'underline',
                    }}
                    onClick={() => excluirProduto(produto.id)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Botão para adicionar produto */}
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

            <span
              className="small fw-medium"
              style={{ color: 'var(--badge-color)' }}
            >
              Adicionar
            </span>
          </div>

          {/* Formulário de cadastro e edição */}
          {mostrarFormulario && (
            <div className="card p-4 mt-4">
              <h5 className="mb-3">
                {produtoEditandoId !== null
                  ? 'Editar produto'
                  : 'Cadastrar novo produto'}
              </h5>

              <form onSubmit={salvarProduto}>
                {/* Nome do produto */}
                <div className="mb-3">
                  <label className="form-label">
                    Nome do produto
                  </label>

                  <input
                    className="form-control"
                    type="text"
                    name="nome"
                    value={novoProduto.nome}
                    onChange={alterarCampo}
                    required
                  />
                </div>

                {/* Imagens do produto */}
                <div className="mb-3">
                  <label className="form-label">
                    Imagens do produto
                  </label>

                  <input
                    className="form-control"
                    type="file"
                    name="imagens"
                    accept="image/*"
                    multiple
                    onChange={(evento) => {
                      const arquivos = Array.from(
                        evento.target.files || []
                      );

                      setNovoProduto((anterior) => ({
                        ...anterior,
                        imagens: arquivos,
                      }));
                    }}
                  />
                </div>

                {/* Descrição */}
                <div className="mb-3">
                  <label className="form-label">Descrição</label>

                  <textarea
                    className="form-control"
                    name="descricao"
                    value={novoProduto.descricao}
                    onChange={alterarCampo}
                    required
                  />
                </div>

                {/* Preço */}
                <div className="mb-3">
                  <label className="form-label">Preço (R$)</label>

                  <input
                    className="form-control"
                    type="number"
                    name="preco"
                    min="0"
                    step="0.01"
                    value={novoProduto.preco}
                    onChange={alterarCampo}
                    required
                  />
                </div>

                {/* Tamanho */}
                <div className="mb-3">
                  <label className="form-label">Tamanho</label>

                  <input
                    className="form-control"
                    type="text"
                    name="tamanho"
                    value={novoProduto.tamanho}
                    onChange={alterarCampo}
                    required
                  />
                </div>

                {/* Cor */}
                <div className="mb-3">
                  <label className="form-label">Cor</label>

                  <input
                    className="form-control"
                    type="text"
                    name="cor"
                    value={novoProduto.cor}
                    onChange={alterarCampo}
                    required
                  />
                </div>

                {/* Categoria */}
                <div className="mb-3">
                  <label className="form-label">Categoria</label>

                  <select
                    className="form-select"
                    name="categoria"
                    value={novoProduto.categoria}
                    onChange={alterarCampo}
                    required
                  >
                    <option value="">
                      Selecione uma categoria
                    </option>

                    {categorias.map((categoria) => (
                      <option
                        key={categoria.id}
                        value={categoria.id}
                      >
                        {categoria.nome}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Estoque */}
                <div className="mb-3">
                  <label className="form-label">Estoque</label>

                  <input
                    className="form-control"
                    type="number"
                    name="estoque"
                    min="0"
                    step="1"
                    value={novoProduto.estoque}
                    onChange={alterarCampo}
                    required
                  />
                </div>

                <button type="submit" className="btn-buy me-2">
                  Salvar produto
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setMostrarFormulario(false);
                    setProdutoEditandoId(null);
                  }}
                >
                  Cancelar
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}