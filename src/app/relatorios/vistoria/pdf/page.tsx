'use client';

import { useEffect, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function GerarPDF() {
  const [conteudoPronto, setConteudoPronto] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const gerarPDF = async () => {
    if (!pdfRef.current) return;

    const canvas = await html2canvas(pdfRef.current, {
      scrollY: 0,
      useCORS: true,
      backgroundColor: '#ffffff',
      scale: 2
    });
    const imgData = canvas.toDataURL('image/jpeg', 1.0);

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'JPEG', 10, 0, pdfWidth - 10, pdfHeight); // recuo de 1,5cm
    pdf.save('relatorio_vistoria.pdf');
  };

  useEffect(() => {
    setTimeout(() => setConteudoPronto(true), 500);
  }, []);

  const dados = JSON.parse(localStorage.getItem('vistoriaRascunho') || '{}');
  const correcoes = JSON.parse(localStorage.getItem('correcoesVistoria') || '[]');
  const fotos = JSON.parse(localStorage.getItem('fotosVistoria') || '[]');
  const consideracoes = localStorage.getItem('consideracoesFinais') || '';

  return (
    <main className="bg-green-50 min-h-screen p-6 flex flex-col items-center space-y-6">
      <h1 className="text-2xl font-bold text-green-700">Visualizar e Gerar PDF</h1>

      <div
        ref={pdfRef}
        style={{
          backgroundColor: '#ffffff',
          color: '#1f4d32',
          padding: '24px',
          paddingLeft: '1cm', // recuo esquerdo
          borderRadius: '8px',
          maxWidth: '768px',
          width: '100%',
          fontSize: '14px',
        }}
      >
        <h2 style={{ fontSize: '18px', borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>
          Relatório de Vistoria
        </h2>
        <p><strong>Cliente:</strong> {dados.cliente}</p>
        <p><strong>Data:</strong> {dados.data}</p>
        <p><strong>Objetivo:</strong> {dados.objetivo}</p>
        <p><strong>Assuntos Abordados:</strong> {dados.assuntos}</p>

        <h2 style={{ fontSize: '18px', borderBottom: '1px solid #ccc', paddingBottom: '4px', marginTop: '24px' }}>
          Correções Identificadas
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead style={{ backgroundColor: '#e6f4ea' }}>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '4px' }}>Identificado</th>
              <th style={{ border: '1px solid #ccc', padding: '4px' }}>Riscos</th>
              <th style={{ border: '1px solid #ccc', padding: '4px' }}>Correção</th>
              <th style={{ border: '1px solid #ccc', padding: '4px' }}>Observações</th>
            </tr>
          </thead>
          <tbody>
            {correcoes.map((c: any, i: number) => (
              <tr key={i}>
                <td style={{ border: '1px solid #ccc', padding: '4px' }}>{c.identificado}</td>
                <td style={{ border: '1px solid #ccc', padding: '4px' }}>{c.riscos}</td>
                <td style={{ border: '1px solid #ccc', padding: '4px' }}>{c.correcao}</td>
                <td style={{ border: '1px solid #ccc', padding: '4px' }}>{c.observacoes}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 style={{ fontSize: '18px', borderBottom: '1px solid #ccc', paddingBottom: '4px', marginTop: '24px' }}>
          Relatório Fotográfico
        </h2>
        {fotos.map((f: any, i: number) => (
          <div key={i} style={{ marginBottom: '16px' }}>
            <img
              src={f.url}
              alt={`Imagem ${i + 1}`}
              style={{
                width: '70%',
                height: 'auto',
                maxHeight: '200px',
                objectFit: 'cover',
                borderRadius: '4px',
                border: '1px solid #ccc',
                marginBottom: '4px',
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            />
            <p style={{ fontSize: '12px', textAlign: 'center' }}>
              <strong>Legenda:</strong> Imagem {i + 1}. {f.identificado}
            </p>
          </div>
        ))}

        <h2 style={{ fontSize: '18px', borderBottom: '1px solid #ccc', paddingBottom: '4px', marginTop: '24px' }}>
          Considerações Finais
        </h2>
        <p style={{ whiteSpace: 'pre-line' }}>{consideracoes}</p>

        <footer style={{ fontSize: '10px', textAlign: 'center', borderTop: '1px solid #ccc', marginTop: '32px', paddingTop: '12px' }}>
          Criado por EngenhariZE Amb | Eng. José Henrick M. S. dos Reis CREA 12647D/RO
        </footer>
      </div>

      {conteudoPronto && (
        <button
          onClick={gerarPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium"
        >
          📥 Baixar Relatório PDF
        </button>
      )}
    </main>
  );
}
