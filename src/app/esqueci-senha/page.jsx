"use client";

import { useState } from "react";
import api from "../api/api";
import "../styles/esqueciSenha.css"; // ✅ Certifique-se que o nome do arquivo está correto e corresponde exatamente ao real

// Página de recuperação de senha
export default function EsqueciSenha() {
  // Estados do formulário
  const [email, setEmail] = useState(""); // Email digitado pelo usuário
  const [mensagem, setMensagem] = useState(""); // Mensagem de sucesso
  const [erro, setErro] = useState(""); // Mensagem de erro
  const [carregando, setCarregando] = useState(false); // Estado de loading do botão

  // Envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setErro("");
    setCarregando(true);

    try {
      // Envia o e-mail para rota de recuperação
      await api.post("/api/auth/forgot-password", { email });
      setMensagem("Um link de recuperação foi enviado para seu e-mail.");
      setEmail(""); // Limpa o campo após envio
    } catch (err) {
      console.error("Erro ao enviar e-mail:", err);
      setErro("Não foi possível enviar o e-mail. Verifique o endereço.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="pagina-esqueci-senha">
      <form className="form-esqueci-senha" onSubmit={handleSubmit}>
        <h1>Recuperar Senha</h1>

        <input
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" disabled={carregando}>
          {carregando ? "Enviando..." : "Enviar link de recuperação"}
        </button>

        {/* Mensagens de retorno */}
        {mensagem && <p className="mensagem">{mensagem}</p>}
        {erro && <p className="erro">{erro}</p>}
      </form>
    </main>
  );
}