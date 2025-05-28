"use client";

import { usePathname } from "next/navigation";
import Topbar from "./Topbar";

// Este componente envolve o layout e decide se o Topbar será exibido com base na rota atual
export default function ClientWrapper({ children }) {
  const pathname = usePathname();

  // Define as rotas onde o Topbar deve ser ocultado
  const esconderTopbar =
    pathname?.startsWith("/buy") ||             // Página pública de compra
    pathname === "/esqueci-senha" ||            // Página de recuperação de senha
    pathname?.startsWith("/order/") ||          // Página pública de status do pedido
    pathname?.startsWith("/resetar-senha");     // Página de redefinição de senha

  return (
    <>
      {/* Exibe o Topbar apenas se a rota não estiver na lista acima */}
      {!esconderTopbar && <Topbar />}
      {children}
    </>
  );
}