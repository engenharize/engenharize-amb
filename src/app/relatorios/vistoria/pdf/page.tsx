'use client';

import { useEffect, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { buscarClientes } from '@/lib/clientes.service';

export default function GerarPDF() {
  const [conteudoPronto, setConteudoPronto] = useState(false);
  const [dados, setDados] = useState<any>(null);
  const [correcoes, setCorrecoes] = useState<any[]>([]);
  const [fotos, setFotos] = useState<any[]>([]);
  const [consideracoes, setConsideracoes] = useState('');
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rascunho = JSON.parse(localStorage.getItem('vistoriaRascunho') || '{}');
    const clienteNome = rascunho.cliente;

    buscarClientes()
      .then((clientes) => {
        const cliente = clientes.find((c: any) => c.nome === clienteNome);
        const correcoes = JSON.parse(localStorage.getItem('correcoesVistoria') || '[]');
        const fotos = JSON.parse(localStorage.getItem('fotosVistoria') || '[]');
        const consideracoes = localStorage.getItem('consideracoesFinais') || '';

        setDados({ ...rascunho, cliente });
        setCorrecoes(correcoes);
        setFotos(fotos);
        setConsideracoes(consideracoes);
        setConteudoPronto(true);
      })
      .catch((err) => console.error('Erro ao buscar cliente:', err));
  }, []);

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
    pdf.addImage(imgData, 'JPEG', 10, 0, pdfWidth - 10, pdfHeight);
    pdf.save('relatorio_vistoria.pdf');
  };

  if (!conteudoPronto || !dados) return <p className="p-8 text-center">Carregando...</p>;

  return (
    <main className="bg-green-50 min-h-screen p-6 flex flex-col items-center space-y-6">
      <h1 className="text-2xl font-bold text-green-700">Visualizar e Gerar PDF</h1>

      <div
        ref={pdfRef}
        style={{
          backgroundColor: '#ffffff',
          color: '#1f4d32',
          padding: '24px',
          paddingLeft: '1cm',
          borderRadius: '8px',
          maxWidth: '768px',
          width: '100%',
          fontSize: '14px',
        }}
      >
        <h2 style={{ fontSize: '18px', borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>
          Relatório de Vistoria
        </h2>
        <p><strong>Cliente:</strong> {dados.cliente?.nome}</p>
        <p><strong>CNPJ:</strong> {dados.cliente?.cnpj}</p>
        <p><strong>Endereço:</strong> {dados.cliente?.endereco}</p>
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
            {correcoes.map((c, i) => (
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
        {fotos.map((f, i) => (
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
