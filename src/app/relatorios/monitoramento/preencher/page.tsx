'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PreencherMonitoramento() {
  const [cliente, setCliente] = useState('');
  const [residuos, setResiduos] = useState([{ setor: '', tipo: '' }]);
  const router = useRouter();

  useEffect(() => {
    const nome = localStorage.getItem('clienteSelecionado');
    if (nome) setCliente(nome);
  }, []);

  const handleChange = (index: number, field: string, value: string) => {
    const atualizados = [...residuos];
    atualizados[index][field as 'setor' | 'tipo'] = value;
    setResiduos(atualizados);
  };

  const adicionarLinha = () => {
    setResiduos([...residuos, { setor: '', tipo: '' }]);
  };

  const seguir = () => {
    localStorage.setItem('residuosGerados', JSON.stringify(residuos));
    router.push('/relatorios/monitoramento/indicadores');
  };

  return (
    <main className="min-h-screen bg-green-50 flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold text-green-700 mb-4 text-center">
        Monitoramento Ambiental - Resíduos Gerados
      </h1>

      <p className="text-green-800 mb-6 font-medium">Cliente: {cliente}</p>

      <div className="w-full max-w-3xl space-y-4">
        {residuos.map((linha, index) => (
          <div
            key={index}
            className="grid grid-cols-2 gap-4 bg-white p-4 border border-green-200 rounded"
          >
            <input
              type="text"
              placeholder="Setor"
              value={linha.setor}
              onChange={(e) => handleChange(index, 'setor', e.target.value)}
              className="p-2 border border-green-300 rounded"
            />
            <input
              type="text"
              placeholder="Resíduos Gerados"
              value={linha.tipo}
              onChange={(e) => handleChange(index, 'tipo', e.target.value)}
              className="p-2 border border-green-300 rounded"
            />
          </div>
        ))}

        <button
          onClick={adicionarLinha}
          className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded"
        >
          ➕ Adicionar Linha
        </button>

        <button
          onClick={seguir}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-medium mt-4"
        >
          ➡️ Seguir
        </button>
      </div>
    </main>
  );
}
