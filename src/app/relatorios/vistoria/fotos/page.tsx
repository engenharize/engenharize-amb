'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface FotoItem {
  url: string;
  identificado: string;
}

export default function RelatorioFotografico() {
  const [identificados, setIdentificados] = useState<string[]>([]);
  const [fotos, setFotos] = useState<FotoItem[]>([]);
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);
  const [itemSelecionado, setItemSelecionado] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const correcoes = localStorage.getItem('correcoesVistoria');
    if (correcoes) {
      const lista = JSON.parse(correcoes);
      const identificadosUnicos = lista.map((item: any) => item.identificado);
      setIdentificados(identificadosUnicos);
    }

    const fotosSalvas = localStorage.getItem('fotosVistoria');
    if (fotosSalvas) {
      setFotos(JSON.parse(fotosSalvas));
    }
  }, []);

  const handleFotoSelecionada = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagemPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAdicionarFoto = () => {
    if (!imagemPreview || !itemSelecionado) {
      alert('Selecione uma imagem e relacione com um item identificado.');
      return;
    }

    const novaFoto = { url: imagemPreview, identificado: itemSelecionado };

    let novaLista;
    if (editIndex !== null) {
      novaLista = [...fotos];
      novaLista[editIndex] = novaFoto;
      setEditIndex(null);
    } else {
      novaLista = [...fotos, novaFoto];
    }

    setFotos(novaLista);
    localStorage.setItem('fotosVistoria', JSON.stringify(novaLista));
    setImagemPreview(null);
    setItemSelecionado('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const editarFoto = (index: number) => {
    const foto = fotos[index];
    setImagemPreview(foto.url);
    setItemSelecionado(foto.identificado);
    setEditIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const excluirFoto = (index: number) => {
    const novaLista = fotos.filter((_, i) => i !== index);
    setFotos(novaLista);
    localStorage.setItem('fotosVistoria', JSON.stringify(novaLista));
  };

  const handleSeguir = () => {
    if (fotos.length === 0) {
      alert('Adicione ao menos uma foto para seguir.');
      return;
    }
    router.push('/relatorios/vistoria/finais');
  };

  const handleVoltar = () => {
    router.push('/relatorios/vistoria/correcoes');
  };

  return (
    <main className="min-h-screen bg-green-50 p-6 space-y-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-green-700 text-center">Relatório Fotográfico</h1>

      <div className="w-full max-w-2xl space-y-4">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={inputRef}
          onChange={handleFotoSelecionada}
          className="w-full p-2 border border-green-300 rounded bg-white text-green-800"
        />

        {imagemPreview && (
          <div className="border border-green-300 rounded p-4 bg-white text-green-800">
            <img src={imagemPreview} alt="Prévia" className="mb-4 max-h-60 mx-auto rounded" />

            <label className="block mb-2 text-green-800 font-medium">
              Relacionar com item identificado:
            </label>
            <select
              value={itemSelecionado}
              onChange={(e) => setItemSelecionado(e.target.value)}
              className="w-full p-2 border border-green-300 rounded text-green-800"
            >
              <option value="">Selecione</option>
              {identificados.map((id, idx) => (
                <option key={idx} value={id}>
                  {id}
                </option>
              ))}
            </select>

            <button
              onClick={handleAdicionarFoto}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              {editIndex !== null ? '✏️ Atualizar Foto' : '📸 Adicionar ao Relatório'}
            </button>
          </div>
        )}

        {fotos.length > 0 && (
          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold text-green-800">Imagens Adicionadas</h2>
            {fotos.map((foto, index) => (
              <div
                key={index}
                className="bg-white border border-green-300 p-4 rounded shadow space-y-2"
              >
                <img src={foto.url} alt={`Imagem ${index + 1}`} className="w-full max-h-60 mb-2 rounded" />
                <p className="text-green-800 text-sm">
                  <strong>Legenda:</strong> Imagem {index + 1}. {foto.identificado}
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => editarFoto(index)}
                    className="text-blue-600 hover:underline"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => excluirFoto(index)}
                    className="text-red-600 hover:underline"
                  >
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between gap-4 mt-8">
          <button
            onClick={handleVoltar}
            className="bg-gray-300 hover:bg-gray-400 text-green-800 px-6 py-2 rounded font-medium"
          >
            🔙 Voltar para Correções
          </button>

          <button
            onClick={handleSeguir}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium"
          >
            ✅ Seguir para Considerações Finais
          </button>
        </div>
      </div>
    </main>
  );
}
