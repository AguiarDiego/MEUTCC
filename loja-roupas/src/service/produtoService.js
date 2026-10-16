
const API_URL = 'http://localhost:8080/produtos';
const CATEGORIAS_URL = 'http://localhost:8080/categorias';
const IMAGENS_URL = 'http://localhost:8080/imagens';

// Busca todos os produtos cadastrados no banco.
export async function listarProdutos() {
  const resposta = await fetch(API_URL);

  if (!resposta.ok) {
    throw new Error('Erro ao buscar produtos.');
  }

  return await resposta.json();
}

// Busca um produto específico pelo ID.
export async function buscarProdutoPorId(id) {
  const resposta = await fetch(`${API_URL}/${id}`);

  if (!resposta.ok) {
    throw new Error('Erro ao buscar produto.');
  }

  return await resposta.json();
}

// Cadastra um produto novo no banco.
export async function cadastrarProduto(produto) {
  const resposta = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(produto),
  });

  if (!resposta.ok) {
    throw new Error('Erro ao cadastrar produto.');
  }

  return await resposta.json();
}

// Atualiza um produto existente.
export async function atualizarProduto(id, produto) {
  const resposta = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(produto),
  });

  if (!resposta.ok) {
    throw new Error('Erro ao atualizar produto.');
  }

  return await resposta.json();
}

// Exclui um produto pelo ID.
export async function excluirProduto(id) {
  const resposta = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!resposta.ok) {
    throw new Error('Erro ao excluir produto.');
  }
}

// Busca as categorias cadastradas no banco.
export async function listarCategorias() {
  const resposta = await fetch(CATEGORIAS_URL);

  if (!resposta.ok) {
    throw new Error('Erro ao buscar categorias.');
  }

  return await resposta.json();
}

// Envia a imagem de um produto para o backend.
export async function enviarImagemProduto(produtoId, arquivo) {
  const dadosFormulario = new FormData();

  dadosFormulario.append('arquivo', arquivo);

  const resposta = await fetch(
    `${IMAGENS_URL}/produto/${produtoId}`,
    {
      method: 'POST',
      body: dadosFormulario,
    }
  );

  if (!resposta.ok) {
    throw new Error('Erro ao enviar a imagem do produto.');
  }

  // Algumas APIs não retornam conteúdo após o envio.
  const texto = await resposta.text();

  return texto ? JSON.parse(texto) : null;
}