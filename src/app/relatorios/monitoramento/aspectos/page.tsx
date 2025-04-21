'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AspectosImpactos() {
  const [cliente, setCliente] = useState('');
  const [linhas, setLinhas] = useState([
    { atividade: '', aspecto: '', impacto: '', controle: '' },
  ]);

  const router = useRouter();

  useEffect(() => {
    const nome = localStorage.getItem('clienteSelecionado');
    if (nome) setCliente(nome);
  }, []);

  const handleChange = (index: number, field: string, value: string) => {
    const atualizadas = [...linhas];
    atualizadas[index][field as keyof typeof atualizadas[0]] = value;
    setLinhas(atualizadas);
  };

  const adicionarLinha = () => {
    setLinhas([...linhas, { atividade: '', aspecto: '', impacto: '', controle: '' }]);
  };

  const seguir = () => {
    localStorage.setItem('aspectosImpactos', JSON.stringify(linhas));
    router.push('/relatorios/monitoramento/fotografico');
  };

  return (
    <main className="min-h-screen bg-green-50 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-4 text-center">
        Monitoramento Ambiental - Aspectos e Impactos
      </h1>
      <p className="text-green-800 mb-6 font-medium">Cliente: {cliente}</p>

      <div className="w-full max-w-5xl space-y-4">
        {linhas.map((linha, index) => (
          <div
            key={index}
            className="grid grid-cols-4 gap-4 bg-white p-4 border border-green-200 rounded"
          >
            <input
              type="text"
              placeholder="Atividade"
              value={linha.atividade}
              onChange={(e) => handleChange(index, 'atividade', e.target.value)}
              className="p-2 border border-green-300 rounded text-green-800"
            />
            <input
              type="text"
              placeholder="Aspecto"
              value={linha.aspecto}
              onChange={(e) => handleChange(index, 'aspecto', e.target.value)}
              className="p-2 border border-green-300 rounded text-green-800"
            />
            <input
              type="text"
              placeholder="Impacto"
              value={linha.impacto}
              onChange={(e) => handleChange(index, 'impacto', e.target.value)}
              className="p-2 border border-green-300 rounded text-green-800"
            />
            <input
              type="text"
              placeholder="Medidas de Controle"
              value={linha.controle}
              onChange={(e) => handleChange(index, 'controle', e.target.value)}
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
          ➡️ Avançar para Relatório Fotográfico
        </button>
      </div>
    </main>
  );
}
