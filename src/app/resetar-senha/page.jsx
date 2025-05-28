'use client'; // ⚠️ Indica que esse componente deve ser executado no client-side (Next.js App Router)

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '../api/api'; // ✅ Importa o cliente Axios centralizado

export default function ResetarSenha() {
  const router = useRouter(); // Hook para redirecionamento de páginas
  const searchParams = useSearchParams(); // Hook para ler parâmetros da URL

  const token = searchParams.get('token'); // 🔐 Token vindo por e-mail
  const email = searchParams.get('email'); // ✉️ E-mail do usuário

  const [novaSenha, setNovaSenha] = useState(''); // 📝 Campo de nova senha
  const [mensagem, setMensagem] = useState('');   // ℹ️ Mensagem de sucesso ou erro
  const [carregando, setCarregando] = useState(false); // ⏳ Loading do botão

  // ✅ Verifica se os parâmetros obrigatórios existem
  useEffect(() => {
    if (!token || !email) {
      setMensagem('Link inválido ou incompleto.');
    }
  }, [token, email]);

  // 🔁 Envia nova senha para o backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setMensagem('');

    try {
      await api.post('/api/auth/reset-password', {
        token,
        email,
        novaSenha, // ✅ Backend espera esse campo
      });

      setMensagem('Senha redefinida com sucesso!');
      setTimeout(() => router.push('/login'), 2000); // 🔁 Redireciona após 2s
    } catch (err) {
      const msg = err?.response?.data?.message || 'Erro ao redefinir a senha.';
      setMensagem(msg);
    }

    setCarregando(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 400, margin: 'auto' }}>
      <h2>Redefinir Senha</h2>

      {/* Mensagem de erro ou sucesso */}
      {mensagem && (
        <p
          style={{
            color: mensagem.includes('sucesso') ? 'green' : 'red',
            marginBottom: '1rem',
          }}
        >
          {mensagem}
        </p>
      )}

      {/* Formulário de redefinição */}
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nova senha"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />

        <button
          type="submit"
          disabled={carregando}
          style={{ width: '100%', padding: '0.5rem' }}
        >
          {carregando ? 'Enviando...' : 'Redefinir Senha'}
        </button>
      </form>
    </div>
  );
}