"use client"; // Habilita recursos client-side no Next.js (useState, useRouter, etc.)

// Importações React e ferramentas de navegação e API
import { useState } from "react";
import { useRouter } from "next/navigation"; // Para navegação programática
import api from "../api/api"; // Cliente HTTP centralizado
import "../styles/login.css"; // Estilos CSS aplicados

// Componente da página de registro
export default function RegisterPage() {
  const router = useRouter();

  // Estado do formulário
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmar: "",
  });

  // Estados auxiliares
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  // Atualiza os campos
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Envia o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    if (form.senha !== form.confirmar) {
      setErro("As senhas não coincidem");
      return;
    }

    setCarregando(true);

    try {
      const data = await api.post("/api/auth/register", {
        nome: form.nome,
        email: form.email,
        senha: form.senha,
      });

      // Salva o token
      localStorage.setItem("token", data.token);

      // Redireciona para o dashboard e força reload para refletir estado autenticado
      router.push("/dashboard");
      setTimeout(() => {
        window.location.reload(); // Força atualização da página
      }, 100); // Pequeno delay para garantir que o push ocorra antes do reload

    } catch (err) {
      console.error("❌ Erro no registro:", err);
      setErro(err?.response?.data?.erro || "Erro ao registrar");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Criar Conta</h1>

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

          {erro && <p className="login-erro">{erro}</p>}

          <button type="submit" className="btn-neon" disabled={carregando}>
            {carregando ? "Enviando..." : "Registrar"}
          </button>
        </form>

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