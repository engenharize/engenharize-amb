'use client';

import { useEffect, useState } from 'react';
import { addMonths, isBefore } from 'date-fns';

export default function Vencimentos() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState('');
  const [emissaoLicenca, setEmissaoLicenca] = useState('');
  const [vencimentoLicenca, setVencimentoLicenca] = useState('');
  const [vencimentoAVCIP, setVencimentoAVCIP] = useState('');
  const [rmas, setRMAs] = useState<Date[]>([]);

  useEffect(() => {
    const dados = localStorage.getItem('clientes');
    if (dados) {
      setClientes(JSON.parse(dados));
    }
  }, []);

  const gerarRMAs = () => {
    if (!emissaoLicenca || !vencimentoLicenca) return;

    const dataEmissao = new Date(emissaoLicenca);
    const dataVencimento = new Date(vencimentoLicenca);
    const datasRMA: Date[] = [];

    let atual = new Date(dataEmissao);
    while (isBefore(atual, dataVencimento)) {
      atual = addMonths(atual, 6);
      if (isBefore(atual, dataVencimento)) {
        datasRMA.push(new Date(atual));
      }
    }

    setRMAs(datasRMA);

    const dados = {
      cliente: clienteSelecionado,
      emissaoLicenca,
      vencimentoLicenca,
      vencimentoAVCIP,
      datasRMA: datasRMA.map((d) => d.toISOString()),
    };

    localStorage.setItem(`vencimentos-${clienteSelecionado}`, JSON.stringify(dados));
    alert('Vencimentos e RMA salvos com sucesso!');
  };

  return (
    <main className="min-h-screen bg-green-50 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-6 text-center">Cadastro de Vencimentos</h1>

      <div className="w-full max-w-xl space-y-4 bg-white p-6 rounded-xl shadow border">
        <select
          value={clienteSelecionado}
          onChange={(e) => setClienteSelecionado(e.target.value)}
          className="w-full p-2 border border-green-300 rounded"
        >
          <option value="">Selecione um cliente</option>
          {clientes.map((c, i) => (
            <option key={i} value={c.nome}>
              {c.nome}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col text-sm">
            Data de Emissão da Licença Ambiental
            <input
              type="date"
              value={emissaoLicenca}
              onChange={(e) => setEmissaoLicenca(e.target.value)}
              className="p-2 border border-green-300 rounded"
            />
          </label>

          <label className="flex flex-col text-sm">
            Vencimento da Licença Ambiental
            <input
              type="date"
              value={vencimentoLicenca}
              onChange={(e) => setVencimentoLicenca(e.target.value)}
              className="p-2 border border-green-300 rounded"
            />
          </label>

          <label className="flex flex-col text-sm md:col-span-2">
            Vencimento do AVCIP
            <input
              type="date"
              value={vencimentoAVCIP}
              onChange={(e) => setVencimentoAVCIP(e.target.value)}
              className="p-2 border border-green-300 rounded"
            />
          </label>
        </div>

        <button
          onClick={gerarRMAs}
          disabled={!clienteSelecionado || !emissaoLicenca || !vencimentoLicenca}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-medium mt-4"
        >
          💾 Salvar e Gerar RMAs
        </button>

        {rmas.length > 0 && (
          <div className="mt-6">
            <h2 className="font-bold text-green-700 mb-2">📅 Próximos RMA:</h2>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {rmas.map((data, i) => (
                <li key={i}>{new Date(data).toLocaleDateString('pt-BR')}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
