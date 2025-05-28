"use client"; // Permite uso de hooks e navegação no lado do cliente

// Importa os estilos e dependências
import "../styles/pedidos.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../api/api";

export default function PedidosPage() {
  const router = useRouter(); // Hook para redirecionamento
  const [pedidos, setPedidos] = useState([]); // Estado que armazena os pedidos carregados

  // Carrega os pedidos ao montar o componente
  useEffect(() => {
    const carregarPedidos = async () => {
      try {
        const data = await api.get("/api/orders/dashboard");

        // Formata os dados recebidos para uso na tabela
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

        setPedidos(formatados); // Atualiza o estado com os dados formatados
      } catch (err) {
        console.error("Erro ao carregar pedidos:", err);
      }
    };

    carregarPedidos();
  }, []);

  return (
    <main className="pagina-pedidos">
      <h1 className="titulo-pedidos">Seus Pedidos</h1>
      <table className="tabela-pedidos">
        <thead>
          <tr><th>Cliente</th><th>Produto</th><th>Valor</th><th>Status</th><th>Data</th><th></th></tr>
        </thead>
        <tbody>
          {pedidos.map((p) => (
            <tr key={p.uuid}>
              <td data-label="Cliente">{p.cliente}</td>
              <td data-label="Produto">{p.produto}</td>
              <td data-label="Valor">R$ {p.valor.toFixed(2)}</td>
              <td data-label="Status" className={`status-${p.status.toLowerCase()}`}>{p.status}</td>
              <td data-label="Data">{p.criadoEm}</td>
              <td data-label="Ação">
                <button
                  className="botao-detalhes"
                  onClick={() => router.push(`/order/${p.uuid}`)}
                >
                  Ver detalhes
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}