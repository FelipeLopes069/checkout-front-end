'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../api/api";
import "../styles/login.css"; // ✅ Certifique-se de que o nome e o caminho do CSS estão corretos

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({ email: "", senha: "" });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      localStorage.removeItem("token");

      const data = await api.post("/api/auth/login", form);
      localStorage.setItem("token", data.token);

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
            >
              👁️
            </span>
          </div>

          {erro && <p className="login-erro">{erro}</p>}

          <button type="submit" className="btn-neon" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>

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