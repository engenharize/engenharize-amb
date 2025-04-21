'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { buscarClientes } from '@/lib/clientes.service';

export default function MonitoramentoSelectCliente() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [selecionado, setSelecionado] = useState('');
  const router = useRouter();

  // Carrega os clientes salvos no Supabase
  useEffect(() => {
    buscarClientes().then(setClientes).catch((err) => {
      console.error('Erro ao buscar clientes:', err);
    });
  }, []);

  const handleAvancar = () => {
    if (selecionado) {
      localStorage.setItem('clienteSelecionado', selecionado); // salva o nome para usar na próxima tela
      router.push('/relatorios/monitoramento/preencher');
    }
  };

  const handleNovoCliente = () => {
    router.push('/clientes');
  };

  return (
    <main className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-8 space-y-6">
      <h1 className="text-3xl font-bold text-green-700 mb-4 text-center">
        Monitoramento Ambiental - Selecione um Cliente
      </h1>

      <select
        value={selecionado}
        onChange={(e) => setSelecionado(e.target.value)}
        className="w-full max-w-md p-2 border border-green-300 rounded"
      >
        <option value="">Selecione um cliente cadastrado</option>
        {clientes.map((cliente, index) => (
          <option key={index} value={cliente.nome}>
            {cliente.nome}
          </option>
        ))}
      </select>

      <div className="flex gap-4">
        <button
          onClick={handleNovoCliente}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          ➕ Cadastrar novo cliente
        </button>

        <button
          onClick={handleAvancar}
          disabled={!selecionado}
          className={`px-4 py-2 rounded text-white transition ${
            selecionado
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-green-300 cursor-not-allowed'
          }`}
        >
          ✅ Seguir
        </button>
      </div>
    </main>
  );
}
