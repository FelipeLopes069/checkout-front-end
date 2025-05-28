'use client'; // ⬅️ Indica que este componente usa recursos de cliente (hooks, navegação etc)

import Link from 'next/link'; // ⬅️ Para navegação entre rotas do Next.js
import './styles/home.css';   // ⬅️ Estilização específica da home

// Componente principal da página inicial
export default function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">
          Centralize Seus Resultados.<br />
          Escale com Estrutura Própria.
        </h1>

        <p className="home-desc">
          Uma plataforma completa para você processar suas vendas com controle total, segurança e lucros diretos.
        </p>

        <div className="home-buttons">
          <Link href="/login">
            {/* Botão estilizado levando para o login */}
            <button className="btn-neon">Acessar Painel do Vendedor</button>
          </Link>
        </div>
      </div>
    </div>
  );
}