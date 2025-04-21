'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CorrecoesVistoria() {
  const [identificado, setIdentificado] = useState('');
  const [riscos, setRiscos] = useState('');
  const [correcao, setCorrecao] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [itens, setItens] = useState<any[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const salvos = localStorage.getItem('correcoesVistoria');
    if (salvos) {
      setItens(JSON.parse(salvos));
    }
  }, []);

  const salvarLista = (lista: any[]) => {
    setItens(lista);
    localStorage.setItem('correcoesVistoria', JSON.stringify(lista));
  };

  const adicionarOuAtualizar = () => {
    if (!identificado || !riscos || !correcao) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    const item = { identificado, riscos, correcao, observacoes };

    if (editIndex !== null) {
      const novaLista = [...itens];
      novaLista[editIndex] = item;
      salvarLista(novaLista);
      setEditIndex(null);
    } else {
      salvarLista([...itens, item]);
    }

    setIdentificado('');
    setRiscos('');
    setCorrecao('');
    setObservacoes('');
  };

  const editarItem = (index: number) => {
    const item = itens[index];
    setIdentificado(item.identificado);
    setRiscos(item.riscos);
    setCorrecao(item.correcao);
    setObservacoes(item.observacoes || '');
    setEditIndex(index);
  };

  const excluirItem = (index: number) => {
    const novaLista = itens.filter((_, i) => i !== index);
    salvarLista(novaLista);
  };

  const handleSeguir = () => {
    if (itens.length === 0) {
      alert('Adicione pelo menos uma correção antes de seguir.');
      return;
    }

    router.push('/relatorios/vistoria/fotos');
  };

  return (
    <main className="min-h-screen bg-green-50 flex flex-col items-center p-8 space-y-6">
      <h1 className="text-2xl font-bold text-green-700 text-center">
        Correções Identificadas na Vistoria
      </h1>

      <div className="w-full max-w-3xl space-y-4">
        <div>
          <label className="font-medium text-green-800">Identificado *</label>
          <input
            type="text"
            value={identificado}
            onChange={(e) => setIdentificado(e.target.value)}
            className="w-full p-2 border border-green-300 rounded text-green-800"
            placeholder="O que foi identificado?"
          />
        </div>

        <div>
          <label className="font-medium text-green-800">Riscos/Implicações *</label>
          <textarea
            value={riscos}
            onChange={(e) => setRiscos(e.target.value)}
            className="w-full p-2 border border-green-300 rounded h-24 text-green-800"
            placeholder="Quais os riscos ou implicações da não correção?"
          />
        </div>

        <div>
          <label className="font-medium text-green-800">Correção *</label>
          <textarea
            value={correcao}
            onChange={(e) => setCorrecao(e.target.value)}
            className="w-full p-2 border border-green-300 rounded h-24 text-green-800"
            placeholder="Qual correção deve ser feita?"
          />
        </div>

        <div>
          <label className="font-medium text-green-800">Observações</label>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            className="w-full p-2 border border-green-300 rounded h-20 text-green-800"
            placeholder="Observações adicionais (opcional)"
          />
        </div>

        <div className="flex justify-between gap-4 mt-6">
          <button
            onClick={adicionarOuAtualizar}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-medium"
          >
            {editIndex !== null ? '✏️ Atualizar' : '➕ Adicionar'}
          </button>

          <button
            onClick={handleSeguir}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium"
          >
            ✅ Seguir
          </button>
        </div>

        {/* Tabela visual com texto verde */}
        {itens.length > 0 && (
          <div className="mt-10 overflow-x-auto">
            <h2 className="text-xl font-semibold text-green-800 mb-2">Tabela de Correções</h2>
            <table className="w-full border border-green-300 rounded bg-white text-sm text-green-800">
              <thead className="bg-green-200 text-green-900">
                <tr>
                  <th className="p-2 border">Identificado</th>
                  <th className="p-2 border">Riscos</th>
                  <th className="p-2 border">Correção</th>
                  <th className="p-2 border">Observações</th>
                  <th className="p-2 border">Ações</th>
                </tr>
              </thead>
              <tbody>
                {itens.map((item, index) => (
                  <tr key={index} className="text-center">
                    <td className="p-2 border">{item.identificado}</td>
                    <td className="p-2 border">{item.riscos}</td>
                    <td className="p-2 border">{item.correcao}</td>
                    <td className="p-2 border">{item.observacoes}</td>
                    <td className="p-2 border space-x-2">
                      <button
                        onClick={() => editarItem(index)}
                        className="text-blue-600 hover:underline"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => excluirItem(index)}
                        className="text-red-600 hover:underline"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
