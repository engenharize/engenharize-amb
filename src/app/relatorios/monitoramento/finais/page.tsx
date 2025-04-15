'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ConsideracoesFinais() {
  const [cliente, setCliente] = useState('');
  const [texto, setTexto] = useState('');
  const router = useRouter();

  useEffect(() => {
    const nome = localStorage.getItem('clienteSelecionado');
    if (nome) setCliente(nome);
  }, []);

  const gerarPDF = () => {
    localStorage.setItem('consideracoesFinais', texto);
    router.push('/relatorios/monitoramento/pdf');
  };

  return (
    <main className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-4 text-center">
        Considerações Finais
      </h1>

      <p className="text-green-800 mb-6 font-medium">Cliente: {cliente}</p>

      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Digite suas considerações finais aqui..."
        rows={8}
        className="w-full max-w-3xl p-4 border border-green-300 rounded text-gray-800"
      />

      <button
        onClick={gerarPDF}
        className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
      >
        📄 Gerar PDF Final
      </button>
    </main>
  );
}
