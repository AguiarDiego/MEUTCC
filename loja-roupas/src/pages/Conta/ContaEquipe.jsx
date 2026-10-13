
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    listarProdutos,
    listarCategorias,
    cadastrarProduto,
    enviarImagemProduto,
    excluirProduto as excluirProdutoAPI,
} from '../../service/produtoService.js';


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

  /*
 * Guarda as categorias recebidas do backend.
 * Inicialmente, a lista fica vazia até a API responder.
 */
const [categorias, setCategorias] = useState([])

const [produtos, setProdutos] = useState([]);
const [carregando, setCarregando] = useState(true);
const [erro, setErro] = useState('');
const navigate = useNavigate();

// Controla se o formulário de cadastro está visível.
const [mostrarFormulario, setMostrarFormulario] = useState(false);


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
    navigate('/loginequipe');
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
    alert(`Editar produto #${id} - funcionalidade a implementar`);
  }

  // Abre o formulário de cadastro de produtos.
  function adicionarItem() {
    setMostrarFormulario(true);
  }


  
  // Envia os dados do formulário para o backend.
  async function salvarProduto(evento) {
    // Impede que a página recarregue ao enviar o formulário.
    evento.preventDefault();

    try {
      // Prepara os dados no formato esperado pelo Spring Boot.
      const produto = {
        nome: novoProduto.nome,
        descricao: novoProduto.descricao,
        preco: Number(novoProduto.preco),
        tamanho: novoProduto.tamanho,
        cor: novoProduto.cor,
        estoque: Number(novoProduto.estoque),

        // O backend espera uma categoria relacionada por ID.
        categoria: {
          id: Number(novoProduto.categoria),
        },
      };

      
    


      // Envia o produto para o endpoint POST /produtos.
      const produtoCadastrado = await cadastrarProduto(produto);

       // Se o usuário selecionou uma imagem, envia para o backend.
      if (novoProduto.imagem) {
        await enviarImagemProduto(
          produtoCadastrado.id,
          novoProduto.imagem
        );
      }


      // Atualiza a lista exibida na tela sem precisar recarregar.
      setProdutos((anteriores) => [
        ...anteriores,
        {
          ...produtoCadastrado,
          name: produtoCadastrado.nome,
          price: Number(produtoCadastrado.preco),
          image: produtoCadastrado.imagem?.caminho
            ? `http://localhost:8080/imagens/${produtoCadastrado.imagem.caminho}`
            : '/Imagem/placeholder.svg',
        },
      ]);

      // Limpa o formulário após o cadastro.
      setNovoProduto({
        nome: '',
        descricao: '',
        preco: '',
        tamanho: '',
        cor: '',
        categoria: '',
        estoque: '',
      });

      setMostrarFormulario(false);
      alert('Produto cadastrado com sucesso!');
    } catch (erro) {
      console.error('Erro ao cadastrar produto:', erro);
      alert('Não foi possível cadastrar o produto. Confira o console e o backend.');
    }
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
         <h5 className="mb-3">Cadastrar novo produto</h5>

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