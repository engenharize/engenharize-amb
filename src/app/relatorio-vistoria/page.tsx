'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VistoriaSelectCliente() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [selecionado, setSelecionado] = useState('');
  const [relatorios, setRelatorios] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const salvos = localStorage.getItem('clientes');
    if (salvos) {
      setClientes(JSON.parse(salvos));
    }
  }, []);

  useEffect(() => {
    if (selecionado) {
      const todosRelatorios = localStorage.getItem('relatoriosVistoria');
      if (todosRelatorios) {
        const relatoriosCliente = JSON.parse(todosRelatorios).filter((r: any) => r.cliente === selecionado);
        setRelatorios(relatoriosCliente);
      } else {
        setRelatorios([]);
      }
    } else {
      setRelatorios([]);
    }
  }, [selecionado]);

  const handleAvancar = () => {
    if (selecionado) {
      localStorage.setItem('clienteSelecionado', selecionado);
      localStorage.removeItem('relatorioEmEdicao'); // inicia novo
      router.push('/relatorios/vistoria/preencher');
    }
  };

  const handleNovoCliente = () => {
    router.push('/clientes');
  };

  const handleEditar = (index: number) => {
    const relatorio = relatorios[index];
    localStorage.setItem('clienteSelecionado', selecionado);
    localStorage.setItem('relatorioEmEdicao', JSON.stringify(relatorio));
    router.push('/relatorios/vistoria/preencher');
  };

  return (
    <main className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-8 space-y-6">
      <h1 className="text-3xl font-bold text-green-700 mb-4 text-center">
        Relatório de Vistoria - Selecione um Cliente
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

      {relatorios.length > 0 && (
        <div className="w-full max-w-2xl bg-white border border-green-200 rounded p-4">
          <h2 className="text-lg font-semibold text-green-600 mb-2">Relatórios anteriores:</h2>
          <ul className="space-y-2">
            {relatorios.map((relatorio, index) => (
              <li key={index} className="flex justify-between items-center border p-2 rounded">
                <span>📅 {relatorio.data || 'Data não informada'}</span>
                <button
                  onClick={() => handleEditar(index)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  ✏️ Editar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

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
          ✅ Novo Relatório
        </button>
      </div>
    </main>
  );
}