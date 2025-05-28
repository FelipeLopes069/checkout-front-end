// Base da API (pode ser substituído por variável de ambiente se necessário)
const baseURL = "https://encouraging-susanne-fynancce-v2-b9604e3e.koyeb.app";

/**
 * Recupera o token JWT armazenado localmente.
 */
function getToken() {
  return localStorage.getItem("token");
}

/**
 * Função genérica para chamadas à API.
 * Adiciona automaticamente o token (se existir) no cabeçalho Authorization.
 * Lida com FormData e tratamento de erros.
 */
async function apiFetch(endpoint, options = {}) {
  const token = getToken();

  // Cabeçalhos dinâmicos
  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.body instanceof FormData
      ? {} // Evita setar Content-Type quando for FormData
      : { "Content-Type": "application/json" }),
    ...options.headers,
  };

  try {
    const res = await fetch(`${baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    // Trata respostas com erro
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.mensagem || "Erro na requisição");
    }

    return await res.json();
  } catch (err) {
    // Pode ser ajustado para mostrar em toast futuramente
    console.error("Erro na API:", err.message);
    throw err;
  }
}

// Exporta funções padronizadas de acesso à API
export default {
  get: (url) => apiFetch(url, { method: "GET" }),
  post: (url, body) =>
    apiFetch(url, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  put: (url, body) =>
    apiFetch(url, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  delete: (url) => apiFetch(url, { method: "DELETE" }),

  /**
   * Upload com FormData — usado para imagens e arquivos.
   */
  upload: (url, formData) =>
    apiFetch(url, {
      method: "POST",
      body: formData,
    }),
};