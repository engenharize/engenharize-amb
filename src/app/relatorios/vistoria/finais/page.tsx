'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ConsideracoesFinais() {
  const [consideracoes, setConsideracoes] = useState('');
  const router = useRouter();

  useEffect(() => {
    const salvas = localStorage.getItem('consideracoesFinais');
    if (salvas) {
      setConsideracoes(salvas);
    }
  }, []);

  const handleSalvar = () => {
    localStorage.setItem('consideracoesFinais', consideracoes);
    alert('Considerações salvas com sucesso!');
  };

  const handleVoltar = () => {
    router.push('/relatorios/vistoria/fotos');
  };

  const handleGerarPDF = () => {
    localStorage.setItem('consideracoesFinais', consideracoes);
    router.push('/relatorios/vistoria/pdf');
  };

  return (
    <main className="min-h-screen bg-green-50 p-6 flex flex-col items-center space-y-6">
      <h1 className="text-2xl font-bold text-green-700 text-center">
        Considerações Finais
      </h1>

      <div className="w-full max-w-2xl space-y-4">
        <label className="block font-medium text-green-800 mb-1">
          Escreva as considerações finais da vistoria:
        </label>
        <textarea
          value={consideracoes}
          onChange={(e) => setConsideracoes(e.target.value)}
          className="w-full p-3 border border-green-300 rounded h-40 text-green-800"
          placeholder="Exemplo: A empresa se mostrou comprometida com as ações corretivas, porém recomenda-se acompanhamento nos próximos 60 dias..."
        />

        <div className="flex justify-between gap-4 mt-4">
          <button
            onClick={handleVoltar}
            className="bg-gray-300 hover:bg-gray-400 text-green-800 px-6 py-2 rounded font-medium"
          >
            🔙 Voltar para Fotos
          </button>

          <button
            onClick={handleSalvar}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-medium"
          >
            💾 Salvar
          </button>

          <button
            onClick={handleGerarPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium"
          >
            📄 Gerar Relatório Final (PDF)
          </button>
        </div>
      </div>
    </main>
  );
}

