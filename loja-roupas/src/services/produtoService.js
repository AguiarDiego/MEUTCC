const API_URL = "http://localhost:8080/produtos";

// Busca todos os produtos cadastrados no banco.
export async function listarProdutos() {
    const resposta = await fetch(API_URL);

    // Verifica se a API respondeu com erro.
    if (!resposta.ok) {
        throw new Error("Erro ao buscar produtos.");
    }

    // Converte a resposta da API de JSON para JavaScript.
    return await resposta.json();
}