'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RelatorioFotografico() {
  const [cliente, setCliente] = useState('');
  const [fotos, setFotos] = useState<{ url: string; legenda: string }[]>([]);
  const router = useRouter();

  useEffect(() => {
    const nome = localStorage.getItem('clienteSelecionado');
    if (nome) setCliente(nome);
  }, []);

  const handleFotoSelecionada = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivos = e.target.files;
    if (!arquivos) return;

    const novasFotos: { url: string; legenda: string }[] = [];
    for (let i = 0; i < arquivos.length; i++) {
      const file = arquivos[i];
      const url = URL.createObjectURL(file);
      novasFotos.push({ url, legenda: '' });
    }

    setFotos((prev) => [...prev, ...novasFotos]);
  };

  const handleLegenda = (index: number, texto: string) => {
    const atualizadas = [...fotos];
    atualizadas[index].legenda = texto;
    setFotos(atualizadas);
  };

  const seguirParaFinais = () => {
    localStorage.setItem('relatorioFotografico', JSON.stringify(fotos));
    router.push('/relatorios/monitoramento/finais');
  };

  return (
    <main className="min-h-screen bg-green-50 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-4 text-center">
        Monitoramento Ambiental - Relatório Fotográfico
      </h1>
      <p className="text-green-800 mb-6 font-medium">Cliente: {cliente}</p>

      <label className="mb-4">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          onChange={handleFotoSelecionada}
          className="hidden"
        />
        <span className="cursor-pointer bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded">
          📷 Tirar foto ou escolher da galeria
        </span>
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {fotos.map((foto, index) => (
          <div key={index} className="bg-white border p-4 rounded shadow-sm">
            <img src={foto.url} alt={`Foto ${index + 1}`} className="w-full h-auto rounded mb-2" />
            <input
              type="text"
              placeholder="Legenda da foto"
              value={foto.legenda}
              onChange={(e) => handleLegenda(index, e.target.value)}
              className="w-full p-2 border border-green-300 rounded"
            />
          </div>
        ))}
      </div>

      <button
        onClick={seguirParaFinais}
        className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        ➡️ Avançar para Considerações Finais
      </button>
    </main>
  );
}
