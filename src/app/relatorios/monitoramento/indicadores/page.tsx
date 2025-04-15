'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function IndicadoresAmbientais() {
  const [cliente, setCliente] = useState('');
  const [dados, setDados] = useState({
    energia: '',
    agua: '',
  });

  const router = useRouter();

  useEffect(() => {
    const nome = localStorage.getItem('clienteSelecionado');
    if (nome) setCliente(nome);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDados({ ...dados, [name]: value });
  };

  const handleAvancar = () => {
    localStorage.setItem('indicadoresAmbientais', JSON.stringify(dados));
    router.push('/relatorios/monitoramento/aspectos');
  };

  return (
    <main className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-4 text-center">
        Monitoramento Ambiental - Indicadores Ambientais
      </h1>

      <p className="text-green-800 mb-6 font-medium">Cliente: {cliente}</p>

      <div className="w-full max-w-md space-y-4">
        <input
          type="number"
          name="energia"
          placeholder="Uso de energia elétrica (kW)"
          value={dados.energia}
          onChange={handleChange}
          className="w-full p-2 border border-green-300 rounded"
        />
        <input
          type="number"
          name="agua"
          placeholder="Uso de água (m³)"
          value={dados.agua}
          onChange={handleChange}
          className="w-full p-2 border border-green-300 rounded"
        />

        <button
          onClick={handleAvancar}
          className="w-full bg-green-600 text-white font-medium py-2 rounded hover:bg-green-700 transition"
        >
          ➡️ Avançar para Aspectos e Impactos
        </button>
      </div>
    </main>
  );
}
