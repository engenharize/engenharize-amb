'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PreencherVistoria() {
  const [cliente, setCliente] = useState('');
  const [data, setData] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [assuntos, setAssuntos] = useState('');
  const router = useRouter();

  useEffect(() => {
    const selecionado = localStorage.getItem('clienteSelecionado');
    if (selecionado) {
      setCliente(selecionado);
    }
  }, []);

  const salvarDados = () => {
    const dados = {
      cliente,
      data,
      objetivo,
      assuntos,
    };

    localStorage.setItem('vistoriaRascunho', JSON.stringify(dados));
  };

  const handleSalvar = () => {
    salvarDados();
    alert('Dados salvos com sucesso!');
  };

  const handleSeguir = () => {
    salvarDados();
    router.push('/relatorios/vistoria/correcoes');
  };

  return (
    <main className="min-h-screen bg-green-50 flex flex-col items-center p-8 space-y-6">
      <h1 className="text-2xl font-bold text-green-700 text-center">
        Relatório de Vistoria - Preenchimento
      </h1>

      <div className="w-full max-w-2xl space-y-4">
        <div>
          <label className="block font-medium text-green-800 mb-1">Cliente:</label>
          <input
            type="text"
            value={cliente}
            disabled
            className="w-full p-2 border border-green-300 rounded bg-gray-100 text-green-800"
          />
        </div>

        <div>
          <label className="block font-medium text-green-800 mb-1">Data da Vistoria:</label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-full p-2 border border-green-300 rounded text-green-800"
          />
        </div>

        <div>
          <label className="block font-medium text-green-800 mb-1">Objetivo:</label>
          <textarea
            value={objetivo}
            onChange={(e) => setObjetivo(e.target.value)}
            className="w-full p-2 border border-green-300 rounded h-24 text-green-800"
            placeholder="Descreva o objetivo da vistoria..."
          />
        </div>

        <div>
          <label className="block font-medium text-green-800 mb-1">Assuntos Abordados:</label>
          <textarea
            value={assuntos}
            onChange={(e) => setAssuntos(e.target.value)}
            className="w-full p-2 border border-green-300 rounded h-32 text-green-800"
            placeholder="Liste os assuntos tratados durante a vistoria..."
          />
        </div>

        <div className="flex justify-between gap-4 mt-6">
          <button
            onClick={handleSalvar}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-medium"
          >
            💾 Salvar
          </button>

          <button
            onClick={handleSeguir}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium"
          >
            ✅ Seguir
          </button>
        </div>
      </div>
    </main>
  );
}
