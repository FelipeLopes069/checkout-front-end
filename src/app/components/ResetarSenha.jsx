'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '../api/api';

export default function ResetarSenha() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [novaSenha, setNovaSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      setMensagem('Link inválido ou incompleto.');
    }
  }, [token, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setMensagem('');

    try {
      await api.post('/api/auth/reset-password', {
        token,
        email,
        novaSenha,
      });

      setMensagem('Senha redefinida com sucesso!');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Erro ao redefinir a senha.';
      setMensagem(msg);
    }

    setCarregando(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 400, margin: 'auto' }}>
      <h2>Redefinir Senha</h2>
      {mensagem && (
        <p style={{
          color: mensagem.includes('sucesso') ? 'green' : 'red',
          marginBottom: '1rem',
        }}>
          {mensagem}
        </p>
      )}
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