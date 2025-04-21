'use client';

import { useEffect, useState } from 'react';
import { addMonths, isBefore, differenceInCalendarDays } from 'date-fns';

export default function Vencimentos() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState('');
  const [emissaoLicenca, setEmissaoLicenca] = useState('');
  const [vencimentoLicenca, setVencimentoLicenca] = useState('');
  const [vencimentoAVCIP, setVencimentoAVCIP] = useState('');
  const [rmas, setRMAs] = useState<Date[]>([]);
  const [lembretes, setLembretes] = useState<any[]>([]);

  useEffect(() => {
    const dados = localStorage.getItem('clientes');
    if (dados) {
      setClientes(JSON.parse(dados));
    }
    carregarLembretes();
  }, []);

  useEffect(() => {
    if (clienteSelecionado) {
      const salvo = localStorage.getItem(`vencimentos-${clienteSelecionado}`);
      if (salvo) {
        const dados = JSON.parse(salvo);
        setEmissaoLicenca(dados.emissaoLicenca || '');
        setVencimentoLicenca(dados.vencimentoLicenca || '');
        setVencimentoAVCIP(dados.vencimentoAVCIP || '');
        setRMAs((dados.datasRMA || []).map((d: string) => new Date(d)));
      } else {
        setEmissaoLicenca('');
        setVencimentoLicenca('');
        setVencimentoAVCIP('');
        setRMAs([]);
      }
    }
  }, [clienteSelecionado]);

  const carregarLembretes = () => {
    const lembretesSalvos: any[] = [];
    const dados = localStorage.getItem('clientes');
    if (dados) {
      const lista = JSON.parse(dados);
      lista.forEach((cliente: any) => {
        const venc = localStorage.getItem(`vencimentos-${cliente.nome}`);
        if (venc) {
          const info = JSON.parse(venc);
          lembretesSalvos.push({ nome: cliente.nome, ...info });
        }
      });
    }
    setLembretes(lembretesSalvos);
  };

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
      datasRMA: datasRMA.map((d: Date) => d.toISOString()),
    };

    localStorage.setItem(`vencimentos-${clienteSelecionado}`, JSON.stringify(dados));
    carregarLembretes();
    alert('Vencimentos e RMA salvos com sucesso!');
  };

  const corAlerta = (dias: number, tipo: 'RMA' | 'AVCIP' | 'LICENCA') => {
    if (tipo === 'LICENCA') {
      if (dias <= 119) return 'text-red-600';
      if (dias <= 139) return 'text-orange-500';
      if (dias <= 160) return 'text-yellow-500';
    } else {
      if (dias <= 9) return 'text-red-600';
      if (dias <= 19) return 'text-orange-500';
      if (dias <= 30) return 'text-yellow-500';
    }
    return '';
  };

  const hoje = new Date();

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
          <label className="flex flex-col text-sm text-green-800">
            Data de Emissão da Licença Ambiental
            <input
              type="date"
              value={emissaoLicenca}
              onChange={(e) => setEmissaoLicenca(e.target.value)}
              className="p-2 border border-green-300 rounded"
              disabled={!clienteSelecionado}
            />
          </label>

          <label className="flex flex-col text-sm text-green-800">
            Vencimento da Licença Ambiental
            <input
              type="date"
              value={vencimentoLicenca}
              onChange={(e) => setVencimentoLicenca(e.target.value)}
              className="p-2 border border-green-300 rounded"
              disabled={!clienteSelecionado}
            />
          </label>

          <label className="flex flex-col text-sm text-green-800 md:col-span-2">
            Vencimento do AVCIP
            <input
              type="date"
              value={vencimentoAVCIP}
              onChange={(e) => setVencimentoAVCIP(e.target.value)}
              className="p-2 border border-green-300 rounded"
              disabled={!clienteSelecionado}
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

      <div className="w-full max-w-xl mt-10 space-y-6">
        {lembretes
          .map((l: any) => {
            const avisos: any[] = [];
            const diasLicenca = differenceInCalendarDays(new Date(l.vencimentoLicenca), hoje);
            const diasAVCIP = differenceInCalendarDays(new Date(l.vencimentoAVCIP), hoje);
            const rmaProxima = (l.datasRMA || [])
              .map((r: string) => ({ r, d: differenceInCalendarDays(new Date(r), hoje) }))
              .filter((d: { d: number }) => d.d <= 30);

            if (diasLicenca <= 160) avisos.push({ texto: 'Licença próxima do vencimento', cor: corAlerta(diasLicenca, 'LICENCA') });
            if (diasAVCIP <= 30) avisos.push({ texto: 'AVCIP próximo do vencimento', cor: corAlerta(diasAVCIP, 'AVCIP') });
            rmaProxima.forEach((r: { d: number }) => {
              avisos.push({ texto: `RMA próximo (${r.d} dias)`, cor: corAlerta(r.d, 'RMA') });
            });

            return { nome: l.cliente, licenca: l.vencimentoLicenca, avcip: l.vencimentoAVCIP, rma: rmaProxima[0]?.r, avisos };
          })
          .filter((l) => l.avisos.length > 0)
          .sort((a, b) => {
            const dataA = new Date(a.rma || a.avcip || a.licenca);
            const dataB = new Date(b.rma || b.avcip || b.licenca);
            return dataA.getTime() - dataB.getTime();
          })
          .map((l, i) => {
            const diasLicenca = differenceInCalendarDays(new Date(l.licenca), hoje);
            const diasAVCIP = differenceInCalendarDays(new Date(l.avcip), hoje);
            const diasRMA = l.rma ? differenceInCalendarDays(new Date(l.rma), hoje) : null;

            const textoDias = (dias: number | null) =>
              dias !== null ? (dias >= 0 ? `(Faltam ${dias} dias)` : `(Atrasado ${Math.abs(dias)} dias)`) : '';

            return (
              <div key={i} className="p-4 bg-white rounded shadow border">
                <h3 className="text-green-800 font-bold mb-2">{l.nome}</h3>
                <p className="text-sm text-gray-600">
                  Licença: {new Date(l.licenca).toLocaleDateString('pt-BR')} <span className="text-gray-500">{textoDias(diasLicenca)}</span>
                </p>
                <p className="text-sm text-gray-600">
                  AVCIP: {new Date(l.avcip).toLocaleDateString('pt-BR')} <span className="text-gray-500">{textoDias(diasAVCIP)}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Próximo RMA: {l.rma ? `${new Date(l.rma).toLocaleDateString('pt-BR')} ${textoDias(diasRMA)}` : '---'}
                </p>
                <ul className="mt-2 space-y-1">
                  {l.avisos.map((a: any, j: number) => (
                    <li key={j} className={`${a.cor} text-sm`}>⚠ {a.texto}</li>
                  ))}
                </ul>
              </div>
            );
          })}
      </div>
    </main>
  );
}
