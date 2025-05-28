import React from "react";

// Componente de tabela que exibe a lista de pedidos no dashboard
export default function PedidoTable({ pedidos }) {
  return (
    <div className="dashboard-tabela">
      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Produto</th>
            <th>Valor</th>
            <th>Status</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.length === 0 ? (
            // Caso não existam pedidos
            <tr>
              <td colSpan="5" className="tabela-vazia">
                Nenhum pedido ainda.
              </td>
            </tr>
          ) : (
            // Lista de pedidos renderizados
            pedidos.map((p, i) => (
              <tr key={i}>
                <td>{p.cliente}</td>
                <td>{p.produto}</td>
                <td>R$ {p.valor.toFixed(2)}</td>
                <td>{p.status}</td>
                <td>{new Date(p.data).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}