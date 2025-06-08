'use client'; // Ativa funcionalidades do React Client (Next.js App Router)

// Importações
import { useState } from "react"; // Hook para gerenciar estados
import { useRouter } from "next/navigation"; // Para redirecionar após login
import Link from "next/link"; // Para navegação entre páginas
import api from "../api/api"; // Instância do axios configurado
import "../styles/login.css"; // Estilo visual da página de login

// Componente principal da página de login
export default function LoginPage() {
  const router = useRouter(); // Hook para navegação programática

  // Estados do formulário e controle de interface
  const [form, setForm] = useState({ email: "", senha: "" }); // Campos do login
  const [mostrarSenha, setMostrarSenha] = useState(false); // Toggle visual da senha
  const [erro, setErro] = useState(""); // Mensagem de erro
  const [carregando, setCarregando] = useState(false); // Estado de carregamento

  // Atualiza os campos do formulário conforme o usuário digita
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submete o login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    const controller = new AbortController(); // Controlador de timeout
    const timeout = setTimeout(() => controller.abort(), 5000); // Cancela se demorar mais que 5s

    try {
      localStorage.removeItem("token"); // Garante que não há token anterior

      const data = await api.post("/api/auth/login", form); // Faz requisição de login
      localStorage.setItem("token", data.token); // Salva o token no navegador

      window.location.href = "/dashboard"; // Redireciona após login
    } catch (err) {
      console.error("❌ Erro no login:", err);

      if (err.name === "AbortError") {
        setErro("⏱️ O servidor demorou para responder. Tente novamente.");
      } else if (err.response) {
        const status = err.response.status;
        const msg = err.response.data?.message;

        if (status === 400) {
          setErro("⚠️ Preencha todos os campos corretamente.");
        } else if (status === 401) {
          setErro("🔒 E-mail ou senha incorretos.");
        } else if (status === 403) {
          setErro("🚫 Acesso negado. Verifique suas credenciais.");
        } else if (status === 429) {
          setErro("⛔ Muitas tentativas. Aguarde um pouco e tente novamente.");
        } else if (status >= 500) {
          setErro("💥 Erro interno no servidor. Tente novamente em instantes.");
        } else {
          setErro(msg || "⚠️ Não foi possível realizar o login.");
        }
      } else {
        setErro("🌐 Erro de conexão. Verifique sua internet.");
      }
    } finally {
      clearTimeout(timeout); // Limpa o timeout
      setCarregando(false); // Libera o botão
    }
  };

  // Interface da página de login
  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Entrar no Painel</h1>

        {/* Formulário de login */}
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Seu e-mail"
            value={form.email}
            onChange={handleChange}
            required
          />

          <div className="input-wrapper">
            <input
              type={mostrarSenha ? "text" : "password"} // Alterna exibição da senha
              name="senha"
              placeholder="Senha"
              value={form.senha}
              onChange={handleChange}
              required
            />
            {/* Ícone para mostrar/esconder senha */}
            <span
              className="senha-toggle"
              onClick={() => setMostrarSenha(!mostrarSenha)}
            >
              👁️
            </span>
          </div>

          {/* Exibe erro se existir */}
          {erro && <p className="login-erro">{erro}</p>}

          <button type="submit" className="btn-neon" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {/* Links de navegação */}
        <div className="login-links">
          <p>
            Não tem uma conta?{" "}
            <Link href="/register" className="login-link">
              Criar agora
            </Link>
          </p>
          <p>
            <Link href="/esqueci-senha" className="login-link">
              Esqueci minha senha
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}