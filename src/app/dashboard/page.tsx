'use client';

import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-8 space-y-6">
      <h1 className="text-3xl font-bold text-green-700 mb-10 text-center">
        Painel EngenhariZE Amb
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <button
          onClick={() => router.push('/clientes')}
          className="bg-white shadow-md hover:shadow-xl rounded-2xl p-6 text-center text-green-800 border border-green-300 transition text-lg font-medium"
        >
          🧑‍💼 Cadastrar Cliente
        </button>
        <button
          onClick={() => router.push('/relatorios')}
          className="bg-white shadow-md hover:shadow-xl rounded-2xl p-6 text-center text-green-800 border border-green-300 transition text-lg font-medium"
        >
          📝 Criar Relatório
        </button>
        <button
          onClick={() => router.push('/documentos')}
          className="bg-white shadow-md hover:shadow-xl rounded-2xl p-6 text-center text-green-800 border border-green-300 transition text-lg font-medium"
        >
          📁 Verificar Documentos
        </button>
        <button
          onClick={() => router.push('/vencimentos')}
          className="bg-white shadow-md hover:shadow-xl rounded-2xl p-6 text-center text-green-800 border border-green-300 transition text-lg font-medium"
        >
          📆 Vencimentos
        </button>
        <button
          onClick={() => router.push('/relatorio-vistoria')}
          className="bg-white shadow-md hover:shadow-xl rounded-2xl p-6 text-center text-green-800 border border-green-300 transition text-lg font-medium"
        >
          📋 Relatório de Vistoria
        </button>
      </div>
    </main>
  );
}

