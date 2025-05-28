"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../api/api";
import "../../styles/buy.css"; // Estilos externos organizados no CSS

export default function BuyPage() {
  // Captura o UUID do produto via rota pública (/buy/:uuid)
  const { uuid } = useParams();

  // Estado do produto, formulário, erro, carregamento e pedido criado
  const [produto, setProduto] = useState(null);
  const [erro, setErro] = useState("");
  const [form, setForm] = useState({
    nomeCliente: "",
    emailCliente: "",
    documento: "",
    telefone: "",
  });
  const [carregando, setCarregando] = useState(false);
  const [uuidPedido, setUuidPedido] = useState("");

  // Busca os dados do produto ao montar a página
  useEffect(() => {
    async function carregarProduto() {
      try {
        const data = await api.get(`/api/products/uuid/${uuid}`);
        setProduto(data);
      } catch (err) {
        console.error("Erro ao buscar produto:", err);
        setErro("Produto não encontrado.");
      }
    }

    if (uuid) carregarProduto();
  }, [uuid]);

  // Atualiza os campos do formulário conforme o usuário digita
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Realiza a compra ao enviar o formulário
  const handleCompra = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const res = await api.post("/api/orders", {
        produtoId: produto._id,
        nomeCliente: form.nomeCliente,
        emailCliente: form.emailCliente,
        documento: form.documento,
        telefone: form.telefone,
      });

      if (!res.pedido || !res.pedido.linkPagamento || !res.pedido.uuid) {
        throw new Error("Resposta inválida do servidor.");
      }

      setUuidPedido(res.pedido.uuid);
      window.open(res.pedido.linkPagamento, "_blank"); // Abre o link do PIX em nova aba
    } catch (err) {
      console.error("Erro ao criar pedido:", err);
      setErro("Erro ao processar a compra.");
    } finally {
      setCarregando(false);
    }
  };

  // Renderização condicional
  if (erro) return <p className="erro-compra">{erro}</p>;
  if (!produto) return <p className="carregando-compra">Carregando produto...</p>;

  return (
    <main className="pagina-buy">
      <div className="card-buy">
        {/* Imagem e dados do produto */}
        <img src={produto.imagem} alt={produto.nome} className="produto-imagem" />
        <h1 className="titulo-produto">{produto.nome}</h1>
        <p className="descricao-produto">{produto.descricao}</p>
        <p className="preco-produto">R$ {produto.preco.toFixed(2)}</p>

        {/* Formulário de compra */}
        <form onSubmit={handleCompra} className="form-compra">
          <input
            type="text"
            name="nomeCliente"
            placeholder="Nome completo"
            value={form.nomeCliente}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="emailCliente"
            placeholder="Email"
            value={form.emailCliente}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="documento"
            placeholder="CPF ou CNPJ"
            value={form.documento}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="telefone"
            placeholder="Telefone com DDD"
            value={form.telefone}
            onChange={handleChange}
            required
          />
          <button type="submit" className="botao-comprar" disabled={carregando}>
            {carregando ? "Processando..." : "Comprar Agora"}
          </button>
        </form>

        {/* Link para acompanhar o pedido, visível somente após criação */}
        {uuidPedido && (
          <a href={`/order/${uuidPedido}`} className="botao-status">
            Acompanhar Pedido
          </a>
        )}
      </div>
    </main>
  );
}