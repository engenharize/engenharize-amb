'use client';

import { useEffect, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, HeadingLevel, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { buscarClientePorNome } from '@/lib/clientes.service';

export default function GerarPDFPage() {
  const [dados, setDados] = useState<any>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nome = localStorage.getItem('clienteSelecionado');
    const residuos = JSON.parse(localStorage.getItem('residuosGerados') || '[]');
    const indicadores = JSON.parse(localStorage.getItem('indicadoresAmbientais') || '{}');
    const aspectos = JSON.parse(localStorage.getItem('aspectosImpactos') || '[]');
    const fotos = JSON.parse(localStorage.getItem('relatorioFotografico') || '[]');
    const consideracoes = localStorage.getItem('consideracoesFinais') || '';

    if (nome) {
      buscarClientePorNome(nome).then((cliente) => {
        setDados({ cliente, residuos, indicadores, aspectos, fotos, consideracoes });
      }).catch((error) => {
        console.error('Erro ao buscar cliente do Supabase:', error);
      });
    }
  }, []);

  const gerarPDF = () => {
    const input = contentRef.current;
    if (!input) return;

    setTimeout(async () => {
      const canvas = await html2canvas(input, {
        scrollY: 0,
        useCORS: true,
        backgroundColor: '#ffffff',
        scale: 2
      });
      const imgData = canvas.toDataURL('image/jpeg', 1.0);

      const pdf = new jsPDF('p', 'mm', 'a4');
      const largura = 210;
      const altura = (canvas.height * largura) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, largura, altura);
      pdf.save('relatorio-monitoramento.pdf');
    }, 300);
  };

  const gerarDOCX = async () => {
    if (!dados) return;

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({ text: 'Relatório de Monitoramento Ambiental', heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: `Cliente: ${dados.cliente?.nome}` }),
            new Paragraph({ text: `CNPJ: ${dados.cliente?.cnpj}` }),
            new Paragraph({ text: `Endereço: ${dados.cliente?.endereco}` }),
            new Paragraph({ text: ' ' }),
            new Paragraph({ text: '1. Resíduos Gerados', heading: HeadingLevel.HEADING_2 }),
            new Table({
              rows: [
                new TableRow({
                  children: ['Setor', 'Resíduo Gerado', 'Volume', 'Acondicionamento', 'Destinação Final'].map(c =>
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: c, bold: true })] })] })
                  )
                }),
                ...dados.residuos.map((r: any) =>
                  new TableRow({
                    children: [r.setor, r.gerado, r.volume, r.acondicionamento, r.destinacao].map(c =>
                      new TableCell({ children: [new Paragraph(c)] })
                    )
                  })
                )
              ]
            }),
            new Paragraph({ text: '2. Indicadores Ambientais', heading: HeadingLevel.HEADING_2 }),
            new Paragraph(`Energia: ${dados.indicadores.energia} kW`),
            new Paragraph(`Água: ${dados.indicadores.agua} m³`),
            new Paragraph({ text: '3. Aspectos e Impactos', heading: HeadingLevel.HEADING_2 }),
            new Table({
              rows: [
                new TableRow({
                  children: ['Atividade', 'Aspecto', 'Impacto', 'Controle'].map(c =>
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: c, bold: true })] })] })
                  )
                }),
                ...dados.aspectos.map((a: any) =>
                  new TableRow({
                    children: [a.atividade, a.aspecto, a.impacto, a.controle].map(c =>
                      new TableCell({ children: [new Paragraph(c)] })
                    )
                  })
                )
              ]
            }),
            new Paragraph({ text: '4. Relatório Fotográfico', heading: HeadingLevel.HEADING_2 }),
            ...dados.fotos.map((foto: any) => new Paragraph(`Legenda: ${foto.legenda}`)),
            new Paragraph({ text: '5. Considerações Finais', heading: HeadingLevel.HEADING_2 }),
            new Paragraph(dados.consideracoes),
            new Paragraph({ text: 'Criado por EngenhariZE Amb', heading: HeadingLevel.HEADING_3 })
          ]
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'relatorio-monitoramento.docx');
  };

  if (!dados) return <p className="p-8 text-center">Carregando dados...</p>;

  return (
    <main className="p-4 bg-green-50 min-h-screen flex flex-col items-center">
      <div ref={contentRef} style={{ paddingLeft: '10mm', paddingRight: '16px', paddingTop: '16px', paddingBottom: '16px', borderRadius: '8px', maxWidth: '750px', width: '100%', fontSize: '9pt', fontFamily: 'Arial, sans-serif', color: '#1f4d32', backgroundColor: '#ffffff' }}>
        <h1 style={{ fontSize: '14pt', fontWeight: 'bold', textAlign: 'center', marginBottom: '8px' }}>
          Relatório de Monitoramento Ambiental
        </h1>
        <h2 style={{ fontWeight: 'bold' }}>Cliente: {dados.cliente?.nome}</h2>
        <p><strong>CNPJ:</strong> {dados.cliente?.cnpj}</p>
        <p><strong>Endereço:</strong> {dados.cliente?.endereco}</p>

        <h3 style={{ fontWeight: 'bold', marginTop: '16px', marginBottom: '8px' }}>1. Resíduos Gerados</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9pt' }}>
          <thead>
            <tr style={{ backgroundColor: '#e6f4ea' }}>
              <th style={{ border: '1px solid #ccc', padding: '2px' }}>Setor</th>
              <th style={{ border: '1px solid #ccc', padding: '2px' }}>Resíduo</th>
              <th style={{ border: '1px solid #ccc', padding: '2px' }}>Volume</th>
              <th style={{ border: '1px solid #ccc', padding: '2px' }}>Acondicionamento</th>
              <th style={{ border: '1px solid #ccc', padding: '2px' }}>Destinação</th>
            </tr>
          </thead>
          <tbody>
            {dados.residuos.map((r: any, i: number) => (
              <tr key={i}>
                <td style={{ border: '1px solid #ccc', padding: '2px' }}>{r.setor}</td>
                <td style={{ border: '1px solid #ccc', padding: '2px' }}>{r.gerado}</td>
                <td style={{ border: '1px solid #ccc', padding: '2px' }}>{r.volume}</td>
                <td style={{ border: '1px solid #ccc', padding: '2px' }}>{r.acondicionamento}</td>
                <td style={{ border: '1px solid #ccc', padding: '2px' }}>{r.destinacao}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 style={{ fontWeight: 'bold', marginTop: '16px', marginBottom: '8px' }}>2. Indicadores Ambientais</h3>
        <p><strong>Energia:</strong> {dados.indicadores.energia} kW</p>
        <p><strong>Água:</strong> {dados.indicadores.agua} m³</p>

        <h3 style={{ fontWeight: 'bold', marginTop: '16px', marginBottom: '8px' }}>3. Aspectos e Impactos</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9pt' }}>
          <thead>
            <tr style={{ backgroundColor: '#e6f4ea' }}>
              <th style={{ border: '1px solid #ccc', padding: '2px' }}>Atividade</th>
              <th style={{ border: '1px solid #ccc', padding: '2px' }}>Aspecto</th>
              <th style={{ border: '1px solid #ccc', padding: '2px' }}>Impacto</th>
              <th style={{ border: '1px solid #ccc', padding: '2px' }}>Controle</th>
            </tr>
          </thead>
          <tbody>
            {dados.aspectos.map((a: any, i: number) => (
              <tr key={i}>
                <td style={{ border: '1px solid #ccc', padding: '2px' }}>{a.atividade}</td>
                <td style={{ border: '1px solid #ccc', padding: '2px' }}>{a.aspecto}</td>
                <td style={{ border: '1px solid #ccc', padding: '2px' }}>{a.impacto}</td>
                <td style={{ border: '1px solid #ccc', padding: '2px' }}>{a.controle}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {dados.fotos?.length > 0 && (
          <section>
            <h3 style={{ fontWeight: 'bold', marginTop: '16px', marginBottom: '8px' }}>4. Relatório Fotográfico</h3>
            {dados.fotos.map((foto: any, idx: number) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '12px 0' }}>
                <img
                  src={foto.url}
                  alt={`Foto ${idx + 1}`}
                  style={{
                    maxWidth: '480px',
                    height: 'auto',
                    maxHeight: '320px',
                    objectFit: 'contain',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                  }}
                />
                <p style={{ fontSize: '8pt', fontStyle: 'italic', marginTop: '4px' }}>Legenda: {foto.legenda}</p>
              </div>
            ))}
          </section>
        )}

        <h3 style={{ fontWeight: 'bold', marginTop: '16px', marginBottom: '8px' }}>5. Considerações Finais</h3>
        <p>{dados.consideracoes}</p>

        <footer style={{ fontSize: '8pt', textAlign: 'center', borderTop: '1px solid #ccc', marginTop: '12px', paddingTop: '8px' }}>
          José Henrick M. S. dos Reis CREA 12647D/RO -
          Criado por EngenhariZE Amb
        </footer>
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={gerarPDF}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          📄 Baixar PDF
        </button>
        <button
          onClick={gerarDOCX}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          📝 Baixar Word
        </button>
      </div>
    </main>
  );
}
