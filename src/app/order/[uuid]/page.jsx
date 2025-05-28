"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Hook para capturar o UUID da URL
import api from "../../api/api"; // Módulo de requisições
import "../../styles/order.css"; // Estilos específicos da página de pedido

// Ícones
import {
  FaBox,
  FaCheckCircle,
  FaClock,
  FaUser,
  FaEnvelope,
  FaCreditCard,
} from "react-icons/fa";

export default function PedidoDetalhadoPage() {
  const { uuid } = useParams(); // Captura o UUID do pedido pela URL
  const [pedido, setPedido] = useState(null); // Estado que armazena os dados do pedido
  const [carregando, setCarregando] = useState(true); // Estado de carregamento inicial
  const [erro, setErro] = useState(""); // Estado para exibir mensagens de erro

  // Busca o pedido na API quando o componente for carregado
  useEffect(() => {
    const buscarPedido = async () => {
      try {
        const res = await api.get(`/api/orders/${uuid}`);
        setPedido(res);
      } catch (err) {
        console.error("Erro ao buscar pedido:", err.message);
        setErro("Pedido não encontrado ou expirado.");
      } finally {
        setCarregando(false);
      }
    };

    if (uuid) buscarPedido(); // Só executa se o uuid estiver definido
  }, [uuid]);

  // Enquanto carrega
  if (carregando) {
    return (
      <main className="pagina-pedido">
        <p>Carregando pedido...</p>
      </main>
    );
  }

  // Se houve erro ou não encontrou pedido
  if (erro || !pedido) {
    return (
      <main className="pagina-pedido">
        <h1>Erro</h1>
        <p>{erro}</p>
      </main>
    );
  }

  // Página principal com os dados do pedido
  return (
    <main className="pagina-pedido">
      {/* Título da página */}
      <h1 className="pedido-titulo">
        <FaBox style={{ marginRight: "8px" }} />
        Detalhes do Pedido
      </h1>

      {/* Bloco de status do pagamento */}
      <div className="bloco-status">
        <strong>Status:</strong>{" "}
        <span className={pedido.statusPagamento === "pago" ? "status-pago" : "status-pendente"}>
          {pedido.statusPagamento === "pago" ? (
            <>
              <FaCheckCircle style={{ marginRight: "6px" }} />
              Pagamento Confirmado
            </>
          ) : (
            <>
              <FaClock style={{ marginRight: "6px" }} />
              Aguardando Pagamento
            </>
          )}
        </span>
      </div>

      {/* Bloco com informações do cliente */}
      <div className="bloco-cliente">
        <p><FaUser style={{ marginRight: "6px" }} /> {pedido.nomeCliente}</p>
        <p><FaEnvelope style={{ marginRight: "6px" }} /> {pedido.emailCliente}</p>
      </div>

      {/* Bloco com informações do produto */}
      <div className="bloco-produto">
        <img
          src={pedido.produto.imagem}
          alt={pedido.produto.nome}
          className="produto-imagem"
        />
        <div>
          <h2>{pedido.produto.nome}</h2>
          <p>{pedido.produto.descricao}</p>
          <p><strong>Preço:</strong> R$ {pedido.produto.preco.toFixed(2)}</p>
        </div>
      </div>

      {/* Bloco com botão para pagar (se ainda não estiver pago) */}
      {pedido.statusPagamento !== "pago" && (
        <div className="bloco-acoes">
          <a
            href={pedido.linkPagamento}
            target="_blank"
            rel="noopener noreferrer"
            className="botao-comprar"
          >
            <FaCreditCard style={{ marginRight: "6px" }} />
            Pagar agora
          </a>
        </div>
      )}
    </main>
  );
}