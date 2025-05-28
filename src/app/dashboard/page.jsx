'use client'; // Habilita o uso de hooks (React) no lado do cliente

// Hooks do React e Next.js
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// API centralizada
import api from "../api/api";

// Estilo do dashboard
import "../styles/dashboard.css";

// Ícones para os cards e botões
import {
  FaDollarSign,
  FaShoppingCart,
  FaBoxOpen,
  FaUser,
  FaPlus,
  FaEdit,
} from "react-icons/fa";

export default function Dashboard() {
  const router = useRouter(); // Para redirecionamento
  const [carregando, setCarregando] = useState(true); // Estado para exibir "Carregando..."
  
  // Estado para armazenar os dados do resumo geral do sistema
  const [resumo, setResumo] = useState({
    totalVendas: 0,
    totalPedidos: 0,
    produtos: 0,
    clientes: 0,
  });

  // Lista com os últimos pedidos exibidos na tabela
  const [pedidos, setPedidos] = useState([]);

  // Carrega os dados do dashboard ao montar o componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // Redireciona se não estiver autenticado
      return;
    }

    const carregarDashboard = async () => {
      try {
        const data = await api.get("/api/orders/dashboard");

        // Atualiza os dados do resumo
        setResumo({
          totalVendas: data.totalVendas,
          totalPedidos: data.totalPedidos,
          produtos: data.produtos,
          clientes: data.clientes,
        });

        // Seleciona os 3 últimos pedidos e formata os dados
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
        setCarregando(false); // Finaliza o carregamento
      }
    };

    // Adiciona pequeno delay para UX
    setTimeout(carregarDashboard, 100);
  }, []);

  // Exibe mensagem temporária enquanto carrega
  if (carregando) {
    return <p style={{ padding: 40, color: "#fff" }}>Carregando dashboard...</p>;
  }

  // Conteúdo principal do dashboard
  return (
    <main className="pagina-dashboard">
      <h1 className="dashboard-titulo">Resumo da Operação</h1>

      {/* Cards de resumo com ícones */}
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

      {/* Tabela com os últimos pedidos */}
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

      {/* Botões de ações rápidas */}
      <h2 className="dashboard-subtitulo">Ações Rápidas</h2>
      <div className="acoes-rapidas">
        <button
          className="botao-acao"
          onClick={() => router.push("/produtos?novo=1")}
        >
          <FaPlus /> Cadastrar Produto
        </button>
        <button
          className="botao-acao"
          onClick={() => router.push("/pedidos/novo")}
        >
          <FaEdit /> Criar Pedido Manual
        </button>
      </div>
    </main>
  );
}