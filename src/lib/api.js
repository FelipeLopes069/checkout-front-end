// src/lib/api.js

// URL base da API
const BASE_URL = 'http://localhost:5000/api';

/**
 * Busca os dados de um produto a partir do UUID de um pedido
 * @param {string} uuid - UUID do pedido
 * @returns {object} - Informações do produto associadas ao pedido
 */
export async function buscarProduto(uuid) {
  const res = await fetch(`${BASE_URL}/orders/${uuid}`);

  if (!res.ok) throw new Error('Erro ao buscar produto');

  const data = await res.json();

  // Retorna os dados estruturados do produto
  return {
    _id: data.produto._id || '', // Garante que sempre haja um _id
    nome: data.produto.nome,
    descricao: data.produto.descricao,
    preco: data.produto.preco,
    imagem: data.produto.imagem,
  };
}

/**
 * Cria um novo pedido manualmente
 * @param {string} produtoId - ID do produto escolhido
 * @param {object} form - Informações do cliente (nome, email, telefone, documento)
 * @returns {object} - Pedido gerado (inclui link de pagamento)
 */
export async function criarPedido(produtoId, form) {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      produtoId,
      nomeCliente: form.nomeCliente,
      emailCliente: form.emailCliente,
      documento: form.documento,
      telefone: form.telefone,
    }),
  });

  if (!res.ok) throw new Error('Erro ao criar pedido');

  const data = await res.json();

  // Retorna os dados do pedido, incluindo o link de pagamento
  return data.pedido;
}