'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PreencherMonitoramento() {
  const [cliente, setCliente] = useState('');
  const [residuos, setResiduos] = useState([
    {
      setor: '',
      gerado: '',
      volume: '',
      acondicionamento: '',
      destinacao: ''
    }
  ]);
  const router = useRouter();

  useEffect(() => {
    const nome = localStorage.getItem('clienteSelecionado');
    if (nome) setCliente(nome);
  }, []);

  const handleChange = (index: number, field: string, value: string) => {
    const atualizados = [...residuos];
    atualizados[index][field as keyof typeof atualizados[0]] = value;
    setResiduos(atualizados);
  };

  const adicionarLinha = () => {
    setResiduos([
      ...residuos,
      {
        setor: '',
        gerado: '',
        volume: '',
        acondicionamento: '',
        destinacao: ''
      }
    ]);
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

      <div className="w-full max-w-6xl space-y-4">
        <div className="grid grid-cols-5 gap-2 text-green-800 font-semibold">
          <span>Setor/Local</span>
          <span>Resíduo Gerado</span>
          <span>Volume de Geração</span>
          <span>Acondicionamento</span>
          <span>Destinação Final</span>
        </div>

        {residuos.map((linha, index) => (
          <div
            key={index}
            className="grid grid-cols-5 gap-2 bg-white p-2 border border-green-200 rounded"
          >
            <input
              type="text"
              placeholder="Setor"
              value={linha.setor}
              onChange={(e) => handleChange(index, 'setor', e.target.value)}
              className="p-2 border border-green-300 rounded text-green-800"
            />
            <input
              type="text"
              placeholder="Resíduo Gerado"
              value={linha.gerado}
              onChange={(e) => handleChange(index, 'gerado', e.target.value)}
              className="p-2 border border-green-300 rounded text-green-800"
            />
            <input
              type="text"
              placeholder="Volume"
              value={linha.volume}
              onChange={(e) => handleChange(index, 'volume', e.target.value)}
              className="p-2 border border-green-300 rounded text-green-800"
            />
            <input
              type="text"
              placeholder="Acondicionamento"
              value={linha.acondicionamento}
              onChange={(e) => handleChange(index, 'acondicionamento', e.target.value)}
              className="p-2 border border-green-300 rounded text-green-800"
            />
            <input
              type="text"
              placeholder="Destinação Final"
              value={linha.destinacao}
              onChange={(e) => handleChange(index, 'destinacao', e.target.value)}
              className="p-2 border border-green-300 rounded text-green-800"
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
