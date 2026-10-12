
const API_URL = "http://localhost:8080/produtos";

// Busca todos os produtos cadastrados no banco.
export async function listarProdutos() {
    const resposta = await fetch(API_URL);

    if (!resposta.ok) {
        throw new Error("Erro ao buscar produtos.");
    }

    return await resposta.json();
}

// Cadastra um produto novo no banco.
export async function cadastrarProduto(produto) {
    const resposta = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(produto),
    });

    if (!resposta.ok) {
        throw new Error("Erro ao cadastrar produto.");
    }

    return await resposta.json();
}

// Atualiza um produto existente.
export async function atualizarProduto(id, produto) {
    const resposta = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(produto),
    });

    if (!resposta.ok) {
        throw new Error("Erro ao atualizar produto.");
    }

    return await resposta.json();
}

// Exclui um produto pelo ID através da API.
export async function excluirProduto(id) {
    const resposta = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });

    // Verifica se o backend conseguiu excluir o produto.
    if (!resposta.ok) {
        throw new Error('Erro ao excluir produto.');
    }
}