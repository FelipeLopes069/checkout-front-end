// Importa o CSS global do projeto
import "./styles/globals.css";

// Importa a fonte Inter do Google Fonts
import { Inter } from "next/font/google";

// Importa a Topbar (opcionalmente usada dentro do ClientWrapper)
import Topbar from "./components/Topbar";

// Importa o wrapper que controla a exibição da Topbar baseado no pathname
import ClientWrapper from "./components/ClientWrapper"; // ⬅️ mostra/esconde Topbar conforme rota

// Configuração da fonte Inter
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap", // melhora a troca da fonte em tempo real
});

// Metadata do projeto (usado por Next para SEO e title da aba)
export const metadata = {
  title: "Sistema",
  description: "Painel de Vendas",
};

// RootLayout é o layout principal do App Router
export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        {/* O ClientWrapper pode decidir se mostra ou não a Topbar */}
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}