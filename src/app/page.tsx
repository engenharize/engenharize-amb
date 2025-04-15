'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@engenharize.com' && senha === '123456') {
      router.push('/dashboard');
    } else {
      alert('Usuário ou senha inválidos');
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-4">
      <h1 className="text-3xl font-bold text-green-700 mb-8">Login - EngenhariZE Amb</h1>
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm space-y-4">
        <input
          type="email"
          placeholder="E-mail"
          className="w-full border border-green-300 rounded p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          className="w-full border border-green-300 rounded p-2"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}
