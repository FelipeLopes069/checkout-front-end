"use client"; // Habilita hooks e navegação no client side (Next.js App Router)

import "../styles/pedidos.css"; // Importa o novo CSS com classes renomeadas
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../api/api"; // Importa instância Axios para chamadas à API

export default function PedidosPage() {
  const router = useRouter(); // Permite navegação programática
  const [pedidos, setPedidos] = useState([]); // Armazena a lista de pedidos carregados
  const [responsivoAtivo, setResponsivoAtivo] = useState(false); // Ativa o layout responsivo só no client

  // Executa após montagem no client para ativar layout responsivo via CSS
  useEffect(() => {
    setResponsivoAtivo(true);
  }, []);

  // Carrega pedidos da API ao montar o componente
  useEffect(() => {
    const carregarPedidos = async () => {
      try {
        const data = await api.get("/api/orders/dashboard");

        // Formata os dados para exibição
        const formatados = data.pedidos.map((p) => ({
          uuid: p.uuid,
          cliente: p.nomeCliente,
          produto: p.produto?.nome || "Indefinido",
          valor: p.produto?.preco || 0,
          status: p.statusPagamento === "pago" ? "Pago" : "Aguardando",
          criadoEm: new Date(p.createdAt).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));

        setPedidos(formatados);
      } catch (err) {
        console.error("Erro ao carregar pedidos:", err);
      }
    };

    carregarPedidos();
  }, []);

  return (
    <main className="pedidos-container"> {/* Container principal da página */}
      <h1 className="pedidos-titulo">Seus Pedidos</h1>

      {/* Renderiza a tabela somente após o client estar montado para evitar glitch de responsividade */}
      <div className={responsivoAtivo ? "responsivo-ativo" : ""}>
        <table className="pedidos-tabela">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Produto</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Data</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p.uuid}>
                <td data-label="Cliente">{p.cliente}</td>
                <td data-label="Produto">{p.produto}</td>
                <td data-label="Valor">R$ {p.valor.toFixed(2)}</td>
                <td data-label="Status" className={`status-${p.status.toLowerCase()}`}>
                  {p.status}
                </td>
                <td data-label="Data">{p.criadoEm}</td>
                <td data-label="Ação">
                  <button
                    className="botao-ver"
                    onClick={() => router.push(`/order/${p.uuid}`)} // Redireciona para a página de detalhes
                  >
                    Ver detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}