'use client'; // Habilita o uso de hooks (React) no lado do cliente

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../api/api";
import "../styles/dashboard.css";

import {
  FaDollarSign,
  FaShoppingCart,
  FaBoxOpen,
  FaUser,
  FaPlus,
  // FaEdit, // Ícone removido junto com o botão
} from "react-icons/fa";

export default function Dashboard() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);
  const [resumo, setResumo] = useState({
    totalVendas: 0,
    totalPedidos: 0,
    produtos: 0,
    clientes: 0,
  });
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const carregarDashboard = async () => {
      try {
        const data = await api.get("/api/orders/dashboard");

        setResumo({
          totalVendas: data.totalVendas,
          totalPedidos: data.totalPedidos,
          produtos: data.produtos,
          clientes: data.clientes,
        });

        const ultimos = data.pedidos.slice(0, 3).map((pedido, i) => ({
          id: `PED00${i + 1}`,
          cliente: pedido.nomeCliente,
          produto: pedido.produto?.nome || "Indefinido",
          valor: pedido.produto?.preco || 0,
          status: pedido.statusPagamento === "pago" ? "Pago" : "Aguardando",
          data: new Date(pedido.createdAt).toLocaleDateString("pt-BR"),
        }));

        setPedidos(ultimos);
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
      } finally {
        setCarregando(false);
      }
    };

    setTimeout(carregarDashboard, 100);
  }, []);

  if (carregando) {
    return <p style={{ padding: 40, color: "#fff" }}>Carregando dashboard...</p>;
  }

  return (
    <main className="pagina-dashboard">
      <h1 className="dashboard-titulo">Resumo da Operação</h1>

      <div className="dashboard-cards">
        <div className="card-dashboard">
          <FaDollarSign className="card-icon" />
          <h3>Total de Vendas</h3>
          <p>R$ {resumo.totalVendas.toFixed(2)}</p>
        </div>
        <div className="card-dashboard">
          <FaShoppingCart className="card-icon" />
          <h3>Pedidos Recebidos</h3>
          <p>{resumo.totalPedidos}</p>
        </div>
        <div className="card-dashboard">
          <FaBoxOpen className="card-icon" />
          <h3>Produtos Ativos</h3>
          <p>{resumo.produtos}</p>
        </div>
        <div className="card-dashboard">
          <FaUser className="card-icon" />
          <h3>Clientes Atendidos</h3>
          <p>{resumo.clientes}</p>
        </div>
      </div>

      <h2 className="dashboard-subtitulo">Últimos Pedidos</h2>
      <div className="tabela-container">
        <table className="tabela-pedidos">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Produto</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.cliente}</td>
                <td>{p.produto}</td>
                <td>R$ {p.valor.toFixed(2)}</td>
                <td className={`status ${p.status.toLowerCase()}`}>{p.status}</td>
                <td>{p.data}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="dashboard-subtitulo">Ações Rápidas</h2>
      <div className="acoes-rapidas">
        <button
          className="botao-acao"
          onClick={() => router.push("/produtos?novo=1")}
        >
          <FaPlus /> Cadastrar Produto
        </button>

        {/* Botão removido conforme solicitado */}
        {/*
        <button
          className="botao-acao"
          onClick={() => router.push("/pedidos/novo")}
        >
          <FaEdit /> Criar Pedido Manual
        </button>
        */}
      </div>
    </main>
  );
}