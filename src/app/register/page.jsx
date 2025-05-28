"use client"; // Habilita recursos client-side no Next.js (useState, useRouter, etc.)

// Importações React e ferramentas de navegação e API
import { useState } from "react";
import { useRouter } from "next/navigation"; // Para navegação programática (sem <Link>)
import api from "../api/api"; // Cliente de requisições HTTP centralizado
import "../styles/login.css"; // Estilos CSS aplicados a essa página

// Componente da página de registro
export default function RegisterPage() {
  const router = useRouter();

  // Estado do formulário (campos controlados)
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmar: "",
  });

  // Estados auxiliares
  const [erro, setErro] = useState(""); // Armazena mensagem de erro
  const [carregando, setCarregando] = useState(false); // Controla botão de envio
  const [mostrarSenha, setMostrarSenha] = useState(false); // Alterna visualização da senha
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false); // Alterna visualização da confirmação

  // Atualiza os campos do formulário conforme o usuário digita
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Envia o formulário de registro
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita recarregar a página
    setErro(""); // Limpa erro anterior

    // Validação: senha e confirmação devem coincidir
    if (form.senha !== form.confirmar) {
      setErro("As senhas não coincidem");
      return;
    }

    setCarregando(true); // Ativa spinner no botão

    try {
      // Requisição para o backend
      const data = await api.post("/api/auth/register", {
        nome: form.nome,
        email: form.email,
        senha: form.senha,
      });

      // Salva o token JWT no localStorage
      localStorage.setItem("token", data.token);

      // Redireciona para o dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("❌ Erro no registro:", err);
      // Exibe erro amigável ao usuário
      setErro(err?.response?.data?.erro || "Erro ao registrar");
    } finally {
      setCarregando(false); // Libera botão
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Criar Conta</h1>

        {/* Formulário */}
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="nome"
            placeholder="Seu nome"
            value={form.nome}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Seu e-mail"
            value={form.email}
            onChange={handleChange}
            required
          />

          {/* Campo de senha com botão de visualização */}
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
              title="Mostrar/ocultar senha"
            >
              👁️
            </span>
          </div>

          {/* Campo de confirmação com toggle de visualização */}
          <div className="input-wrapper">
            <input
              type={mostrarConfirmar ? "text" : "password"}
              name="confirmar"
              placeholder="Confirmar senha"
              value={form.confirmar}
              onChange={handleChange}
              required
            />
            <span
              className="senha-toggle"
              onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
              title="Mostrar/ocultar confirmação"
            >
              👁️
            </span>
          </div>

          {/* Mensagem de erro, se houver */}
          {erro && <p className="login-erro">{erro}</p>}

          {/* Botão de envio */}
          <button type="submit" className="btn-neon" disabled={carregando}>
            {carregando ? "Enviando..." : "Registrar"}
          </button>
        </form>

        {/* Link para login */}
        <div className="login-links">
          <p>
            Já tem uma conta?{" "}
            <a href="/login" className="login-link">Entrar</a>
          </p>
        </div>
      </div>
    </div>
  );
}