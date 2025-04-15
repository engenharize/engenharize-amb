'use client';

import { useEffect, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function GerarPDFPage() {
  const [dados, setDados] = useState<any>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Recupera todos os dados salvos no localStorage
    const cliente = localStorage.getItem('clienteSelecionado');
    const residuos = JSON.parse(localStorage.getItem('residuosGerados') || '[]');
    const indicadores = JSON.parse(localStorage.getItem('indicadoresAmbientais') || '{}');
    const aspectos = JSON.parse(localStorage.getItem('aspectosImpactos') || '[]');
    const fotos = JSON.parse(localStorage.getItem('relatorioFotografico') || '[]');
    const consideracoes = localStorage.getItem('consideracoesFinais') || '';

    setDados({ cliente, residuos, indicadores, aspectos, fotos, consideracoes });
  }, []);

  const gerarPDF = async () => {
    const input = contentRef.current;
    if (!input) return;

    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const largura = 210;
    const altura = (canvas.height * largura) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, largura, altura);
    pdf.save('relatorio-monitoramento.pdf');
  };

  if (!dados) return <p className="p-8 text-center">Carregando dados...</p>;

  return (
    <main className="p-6 bg-green-50 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold text-green-800 mb-6">Prévia do Relatório</h1>

      <div ref={contentRef} className="bg-white p-6 w-full max-w-3xl shadow rounded space-y-4 text-sm text-gray-800">
        <header className="text-center border-b pb-2">
          <h2 className="text-lg font-bold">EngenhariZE Amb</h2>
          <p className="text-sm">Relatório de Monitoramento Ambiental</p>
          <p className="text-xs">Cliente: <strong>{dados.cliente}</strong></p>
        </header>

        <section>
          <h3 className="font-bold text-green-700">1. Resíduos Gerados</h3>
          <table className="w-full text-xs border mt-1">
            <thead>
              <tr className="bg-green-100">
                <th className="border p-1">Setor</th>
                <th className="border p-1">Resíduos</th>
              </tr>
            </thead>
            <tbody>
              {dados.residuos.map((r: any, idx: number) => (
                <tr key={idx}>
                  <td className="border p-1">{r.setor}</td>
                  <td className="border p-1">{r.tipo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h3 className="font-bold text-green-700 mt-4">2. Indicadores Ambientais</h3>
          <p>🔌 Energia: <strong>{dados.indicadores.energia} kW</strong></p>
          <p>💧 Água: <strong>{dados.indicadores.agua} m³</strong></p>
        </section>

        <section>
          <h3 className="font-bold text-green-700 mt-4">3. Aspectos e Impactos</h3>
          <table className="w-full text-xs border mt-1">
            <thead>
              <tr className="bg-green-100">
                <th className="border p-1">Atividade</th>
                <th className="border p-1">Aspecto</th>
                <th className="border p-1">Impacto</th>
                <th className="border p-1">Controle</th>
              </tr>
            </thead>
            <tbody>
              {dados.aspectos.map((a: any, idx: number) => (
                <tr key={idx}>
                  <td className="border p-1">{a.atividade}</td>
                  <td className="border p-1">{a.aspecto}</td>
                  <td className="border p-1">{a.impacto}</td>
                  <td className="border p-1">{a.controle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h3 className="font-bold text-green-700 mt-4">4. Relatório Fotográfico</h3>
          {dados.fotos.map((foto: any, idx: number) => (
            <div key={idx} className="mb-3">
              <img src={foto.url} className="w-full max-h-[300px] object-cover rounded border" />
              <p className="text-xs mt-1 italic">Legenda: {foto.legenda}</p>
            </div>
          ))}
        </section>

        <section>
          <h3 className="font-bold text-green-700 mt-4">5. Considerações Finais</h3>
          <p className="text-justify">{dados.consideracoes}</p>
        </section>

        <footer className="text-center text-xs pt-4 border-t mt-4">
          EngenhariZE Amb | CNPJ 00.000.000/0001-00 • contato@engenharize.com.br • www.engenharizeamb.com
        </footer>
      </div>

      <button
        onClick={gerarPDF}
        className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        📄 Baixar PDF
      </button>
    </main>
  );
}
