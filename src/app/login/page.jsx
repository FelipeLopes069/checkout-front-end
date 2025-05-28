"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../api/api";
import "../styles/login.css"; // ✅ Certifique-se de que o nome e o caminho do CSS estão corretos

export default function LoginPage() {
  const router = useRouter();

  // Estados do formulário
  const [form, setForm] = useState({ email: "", senha: "" }); // Campos do login
  const [mostrarSenha, setMostrarSenha] = useState(false); // Alterna entre mostrar/esconder senha
  const [erro, setErro] = useState(""); // Exibe mensagens de erro
  const [carregando, setCarregando] = useState(false); // Controla estado de carregamento do botão

  // Atualiza os campos conforme o usuário digita
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Envia os dados de login para a API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    const controller = new AbortController(); // Para cancelar a requisição se demorar
    const timeout = setTimeout(() => controller.abort(), 5000); // Timeout de 5s

    try {
      localStorage.removeItem("token"); // Limpa token anterior, se houver

      // Envia os dados para a rota de login
      const data = await api.post("/api/auth/login", form);

      // Armazena token retornado no localStorage
      localStorage.setItem("token", data.token);

      // Redireciona para o dashboard (recarrega a página inteira)
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("❌ Erro no login:", err);
      if (err.name === "AbortError") {
        setErro("⏱️ O servidor não respondeu.");
      } else {
        setErro(err.message || "Erro ao conectar.");
      }
    } finally {
      clearTimeout(timeout);
      setCarregando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Entrar no Painel</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Campo de e-mail */}
          <input
            type="email"
            name="email"
            placeholder="Seu e-mail"
            value={form.email}
            onChange={handleChange}
            required
          />

          {/* Campo de senha com botão de visualização 👁️ */}
          <div className="input-wrapper">
            <input
              type={mostrarSenha ? "text" : "password"}
              name="senha"
              placeholder="Senha"
              value={form.senha}
              onChange={handleChange}
              required
            />
            <span
              className="senha-toggle"
              onClick={() => setMostrarSenha(!mostrarSenha)}
            >
              👁️
            </span>
          </div>

          {/* Mensagem de erro, se houver */}
          {erro && <p className="login-erro">{erro}</p>}

          {/* Botão de envio */}
          <button type="submit" className="btn-neon" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {/* Links para cadastro e recuperação de senha */}
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