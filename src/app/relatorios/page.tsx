import Link from 'next/link';

export default function EscolherRelatorio() {
  return (
    <main className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold text-green-700 mb-10">Escolha o tipo de relatório</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <Link
          href="/relatorios/monitoramento"
          className="bg-white shadow-md hover:shadow-xl rounded-2xl p-6 text-center text-green-800 border border-green-300 transition text-lg font-medium"
        >
          📄 Monitoramento Ambiental
        </Link>
        <Link
          href="/relatorios/impactos"
          className="bg-white shadow-md hover:shadow-xl rounded-2xl p-6 text-center text-green-800 border border-green-300 transition text-lg font-medium"
        >
          🌱 Avaliação de Impactos Ambientais
        </Link>
        <Link
          href="/relatorios/pca"
          className="bg-white shadow-md hover:shadow-xl rounded-2xl p-6 text-center text-green-800 border border-green-300 transition text-lg font-medium"
        >
          🛠 Plano de Controle Ambiental
        </Link>
      </div>
    </main>
  );
}
