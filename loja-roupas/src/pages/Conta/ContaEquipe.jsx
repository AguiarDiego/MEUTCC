
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
 * Inicialmente, a lista fica vazia até a API responder.
 */
const [categorias, setCategorias] = useState([])

const [produtos, setProdutos] = useState([]);
const [carregando, setCarregando] = useState(true);
const [erro, setErro] = useState('');
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
// null significa que estamos cadastrando um produto novo.
const [produtoEditandoId, setProdutoEditandoId] = useState(null);

  // Guarda os valores digitados no formulário de cadastro.
  const [novoProduto, setNovoProduto] = useState({
    nome: '',
    descricao: '',
    preco: '',
    tamanho: '',
    cor: '',
    categoria: '',
    estoque: '',
    imagem: null,
  });

  // Atualiza o campo que o usuário modificar.
  function alterarCampo(evento) {
    const { name, value } = evento.target;

    setNovoProduto((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }


 // Busca os produtos reais quando a tela é aberta.
  
  
  // Primeiro: carrega os produtos.
  useEffect(() => {
    async function carregarProdutos() {
      try {
        const dados = await listarProdutos();

        const produtosFormatados = dados.map((produto) => {
          const nomeImagem = produto.imagem?.caminho;

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

  
function sair() {
  localStorage.removeItem('equipeLogada');
  localStorage.removeItem('emailEquipe');

  window.dispatchEvent(new Event('equipeLogadaAtualizada'));

  navigate('/login', { replace: true });
}



  async function excluirProduto(id) {
// Pede confirmação antes de excluir.
const confirmar = window.confirm(
'Tem certeza que deseja excluir este produto?'
);

if (!confirmar) return;

try {
    // Envia o pedido de exclusão para o backend.
    await excluirProdutoAPI(id);

    // Atualiza a tela somente se a API confirmar sucesso.
    setProdutos((prev) =>
        prev.filter((produto) => produto.id !== id)
    );

    alert('Produto excluído com sucesso!');
} catch (erro) {
    console.error('Erro ao excluir produto:', erro);
    alert('Não foi possível excluir o produto.');
}

}

 
function editarProduto(id) {
  // Localiza na lista o produto que o usuário escolheu editar.
  const produto = produtos.find((item) => item.id === id);

  // Interrompe a operação caso o produto não seja encontrado.
  if (!produto) {
    alert('Produto não encontrado.');
    return;
  }

  // Guarda o ID para sabermos que estamos editando, e não cadastrando.
  setProdutoEditandoId(id);

  // Preenche o formulário com os dados atuais do produto.
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
    imagem: null, // Só envia uma imagem se o usuário escolher outra.
  });

  // Torna o formulário visível.
  setMostrarFormulario(true);
}
  

  // Abre o formulário de cadastro de produtos.
  function adicionarItem() {
    setMostrarFormulario(true);
  }


  
  // Envia os dados do formulário para o backend.
  
  // Envia os dados do formulário para o backend.
  async function salvarProduto(evento) {
    // Impede que o navegador recarregue a página.
    evento.preventDefault();

    // Identifica se vamos editar ou cadastrar um produto.
    const estavaEditando = produtoEditandoId !== null;

    try {
      // Prepara os dados no formato esperado pelo Spring Boot.
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
        // Atualiza o produto existente usando o ID.
        await atualizarProduto(produtoEditandoId, produto);
        idProdutoSalvo = produtoEditandoId;
      } else {
        // Cadastra um produto novo.
        const produtoCadastrado = await cadastrarProduto(produto);
        idProdutoSalvo = produtoCadastrado.id;
      }

      // Envia uma imagem se o usuário tiver selecionado um arquivo.
      if (novoProduto.imagem) {
        await enviarImagemProduto(
          idProdutoSalvo,
          novoProduto.imagem
        );
      }

      // Busca novamente os produtos atualizados na API.
      const dados = await listarProdutos();

      const produtosFormatados = dados.map((item) => {
        const nomeImagem = item.imagem?.caminho;

        return {
          ...item,
          name: item.nome,
          price: Number(item.preco),
          image: nomeImagem
            ? `http://localhost:8080/imagens/${nomeImagem}`
            : '/Imagem/placeholder.svg',
        };
      });

      // Atualiza a lista exibida na tela.
      setProdutos(produtosFormatados);

      // Limpa os campos após concluir a operação.
      setNovoProduto({
        nome: '',
        descricao: '',
        preco: '',
        tamanho: '',
        cor: '',
        categoria: '',
        estoque: '',
        imagem: null,
      });

      // Sai do modo de edição e fecha o formulário.
      setProdutoEditandoId(null);
      setMostrarFormulario(false);

      // Mostra uma mensagem de acordo com a operação realizada.
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
            <h6 className="fw-bold mb-2">Dados Pessoais</h6>
          </div>
          <p className="mb-4 small">
            <strong>Nome: </strong>{equipe.nome}
            <br />
            <strong>Email: </strong>{equipe.email}
            <br />
            <strong>RM: </strong>{equipe.rm}
          </p>

          <button type="button" onClick={sair} className="btn btn-dark px-4">
            Sair
          </button>
        </div>

        {/* Coluna direita: editar itens da loja */}
        <div className="col-md-8 ps-md-4">
          <h4 className="mb-4">Editar itens da loja</h4>

        {/* Mostra enquanto a API busca os produtos */}
        {carregando && <p>Carregando produtos...</p>}

        {/* Mostra se acontecer algum erro */}
        {erro && <p className="text-danger">{erro}</p>}

        {/* Mostra os produtos carregados */}
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
              Adicionar
            </span>
          </div>

           {/* Formulário de cadastro de produto */}
          {mostrarFormulario && (
           <div className="card p-4 mt-4">
             <h5 className="mb-3">
            {produtoEditandoId !== null
            ? 'Editar produto'
            : 'Cadastrar novo produto'}
            </h5>

                <form onSubmit={salvarProduto}>
            {/* Nome que aparecerá na loja */}
                    <div className="mb-3">
            <label className="form-label">Nome do produto</label>
              <input
                  className="form-control"
                  type="text"
                  name="nome"
                  value={novoProduto.nome}
                  onChange={alterarCampo}
                  required
              />
                </div>

                {/* Seleciona a imagem do produto no computador. */}
         <div className="mb-3">
         <label className="form-label">Imagem do produto</label>

         <input
        className="form-control"
        type="file"
        name="imagem"
        accept="image/*"
        onChange={(evento) => {
            const arquivo = evento.target.files?.[0] || null;

            setNovoProduto((anterior) => ({
                ...anterior,
                imagem: arquivo,
            }));
             }}
            />
          </div>

                {/* Descrição do produto */}
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

                   {/* Preço de venda */}
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

                    {/* Tamanho da roupa */}
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

                    {/* Cor da roupa */}
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

               {/* Mostra as categorias que vieram do banco de dados. */}
          <select
                 name="categoria"
                 value={novoProduto.categoria}
                 onChange={alterarCampo}
                required
          >
    <option value="">Selecione uma categoria</option>

          {categorias.map((categoria) => (
        <option key={categoria.id} value={categoria.id}>
            {categoria.nome}
        </option>
        ))}
        </select>


            {/* Quantidade disponível em estoque */}
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

                <button
                type="submit"
                className="btn-buy me-2"
            >
                Salvar produto
            </button>



                <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setMostrarFormulario(false)}
            >
                Cancelar
            </button>
               </form>
               

               <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setMostrarFormulario(false)}
           >
            Fechar formulário
         </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}