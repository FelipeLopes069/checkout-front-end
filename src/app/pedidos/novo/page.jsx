// src/app/pedidos/novo/page.jsx
"use client"; // Habilita recursos do cliente, como hooks

import { useState, useEffect } from "react";
import api from "../../api/api"; // Importa o módulo de requisições
import "../../styles/novoPedido.css"; // Estilo específico da página

export default function CriarPedidoPage() {
  // Lista de produtos carregados da API
  const [produtos, setProdutos] = useState([]);

  // Formulário de criação do pedido
  const [form, setForm] = useState({
    produtoId: "",
    nomeCliente: "",
    emailCliente: "",
    documento: "",
    telefone: "",
  });

  // Estado para erros, carregamento e link gerado
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [linkGerado, setLinkGerado] = useState("");

  // Carrega os produtos ao montar o componente
  useEffect(() => {
    const buscarProdutos = async () => {
      try {
        const res = await api.get("/api/products");
        setProdutos(res); // Atualiza a lista de produtos
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
      }
    };

    buscarProdutos();
  }, []);

  // Atualiza os dados do formulário conforme o usuário digita
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submete o formulário e cria o pedido via API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const res = await api.post("/api/orders", form);
      setLinkGerado(res.pedido.linkPagamento); // Exibe link após criação
    } catch (err) {
      console.error("Erro ao criar pedido:", err);
      setErro(err.message || "Erro ao criar pedido");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="pagina-novo-pedido">
      <h1 className="novo-pedido-titulo">Criar Pedido Manual</h1>

      {/* Se já existe link gerado, mostra mensagem de sucesso */}
      {linkGerado ? (
        <div className="mensagem-sucesso">
          <p>✅ Pedido criado com sucesso!</p>
          <a
            href={linkGerado}
            target="_blank"
            rel="noopener noreferrer"
            className="link-pagamento"
          >
            Acessar Link de Pagamento
          </a>
        </div>
      ) : (
        // Formulário de criação de pedido
        <form className="form-novo-pedido" onSubmit={handleSubmit}>
          <label>Produto</label>
          <select
            name="produtoId"
            value={form.produtoId}
            onChange={handleChange}
            required
          >
            <option value="">Selecione um produto</option>
            {produtos.map((produto) => (
              <option key={produto._id} value={produto._id}>
                {produto.nome} - R$ {produto.preco.toFixed(2)}
              </option>
            ))}
          </select>

          <label>Nome do Cliente</label>
          <input
            type="text"
            name="nomeCliente"
            value={form.nomeCliente}
            onChange={handleChange}
            required
          />

          <label>Email do Cliente</label>
          <input
            type="email"
            name="emailCliente"
            value={form.emailCliente}
            onChange={handleChange}
            required
          />

          <label>CPF ou CNPJ</label>
          <input
            type="text"
            name="documento"
            value={form.documento}
            onChange={handleChange}
            required
          />

          <label>Telefone</label>
          <input
            type="text"
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
            required
          />

          {/* Mensagem de erro, se houver */}
          {erro && <p className="mensagem-erro">{erro}</p>}

          {/* Botão de submit com loading */}
          <button type="submit" disabled={carregando}>
            {carregando ? "Gerando Link..." : "Criar Pedido"}
          </button>
        </form>
      )}
    </main>
  );
}