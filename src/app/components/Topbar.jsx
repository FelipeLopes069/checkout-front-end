'use client'; // Habilita o uso de hooks no componente no lado do cliente

// Hooks de navegação do Next.js
import { useRouter, usePathname } from 'next/navigation';

// Ícones da biblioteca react-icons
import {
  FaHome,
  FaBox,
  FaClipboardList,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

// Componentes utilitários do Next.js
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Estilos do Topbar
import '../styles/topbar.css';

export default function Topbar() {
  const router = useRouter(); // Hook para redirecionamento
  const pathname = usePathname(); // Hook para obter a rota atual

  // Estado para decidir se o Topbar será exibido ou não
  const [mostrar, setMostrar] = useState(false);

  // Estado para controlar abertura/fechamento do menu mobile
  const [menuAberto, setMenuAberto] = useState(false);

  // Verifica se a rota atual é pública e oculta o Topbar nessas páginas
  useEffect(() => {
    const rotasPublicas = ['/', '/login', '/register'];
    const rotaEhPublica = rotasPublicas.includes(pathname);
    setMostrar(!rotaEhPublica); // Só mostra o Topbar se a rota não for pública
  }, [pathname]);

  // Função que remove o token do localStorage e redireciona para o login
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  // Se não for para mostrar o Topbar, retorna null
  if (!mostrar) return null;

  return (
    <header className="topbar">
      <div className="topbar-container">
        {/* Nome/logo da aplicação no canto esquerdo */}
        <div className="topbar-logo">Checkout Tech</div>

        {/* Botão para abrir ou fechar o menu lateral (mobile) */}
        <button className="menu-toggle" onClick={() => setMenuAberto(!menuAberto)}>
          {menuAberto ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navegação principal (visível em desktop e mobile) */}
        <nav className={`topbar-nav ${menuAberto ? 'ativo' : ''}`}>
          {/* Link para o dashboard */}
          <Link href="/dashboard" onClick={() => setMenuAberto(false)}>
            <FaHome />
            <span>Dashboard</span>
          </Link>

          {/* Link para a listagem de produtos */}
          <Link href="/produtos" onClick={() => setMenuAberto(false)}>
            <FaBox />
            <span>Produtos</span>
          </Link>

          {/* Link para os pedidos */}
          <Link href="/pedidos" onClick={() => setMenuAberto(false)}>
            <FaClipboardList />
            <span>Pedidos</span>
          </Link>

          {/* Botão para logout */}
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Sair</span>
          </button>
        </nav>
      </div>
    </header>
  );
}