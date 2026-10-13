
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

    /*
        * Busca as categorias cadastradas no banco.
        * Essa função será utilizada para preencher a lista
        * de categorias do formulário de cadastro.
    */

    export async function listarCategorias(){
        const resposta = await fetch("http://localhost:8080/categorias");

         // Se o backend retornar um erro, interrompe a operação.

         if (!resposta.ok) {
            throw new Error("Erro ao buscar categorias.");
         }

         // Converte a resposta JSON em dados que o React consegue utilizar.
         return await resposta.json();
    }


    
/*
 * Envia a imagem de um produto para o backend.
 * Recebe o ID do produto e o arquivo escolhido pelo usuário.
 */
export async function enviarImagemProduto(produtoId, arquivo) {
    // Prepara os dados para enviar um arquivo.
    const dadosFormulario = new FormData();

    // "arquivo" precisa corresponder ao nome esperado pelo backend.
    dadosFormulario.append('arquivo', arquivo);

    // Envia a imagem para o endpoint do produto.
    const resposta = await fetch(
        `http://localhost:8080/imagens/produto/${produtoId}`,
        {
            method: 'POST',
            body: dadosFormulario,
        }
    );

    // Interrompe a operação se o servidor retornar um erro.
    if (!resposta.ok) {
        throw new Error('Erro ao enviar a imagem do produto.');
    }
}
