'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Cliente {
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  proprietario?: string;
  cpf?: string;
  licencaAmbiental?: string;
}

export default function ListaClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    const carregarClientes = async () => {
      const { data, error } = await supabase.from('clientes').select('*');
      if (error) {
        console.error('Erro ao carregar clientes:', error.message);
      } else {
        setClientes(data || []);
      }
    };

    carregarClientes();
  }, []);

  return (
    <main className="min-h-screen bg-green-50 p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Clientes Cadastrados</h1>
      {clientes.length === 0 ? (
        <p className="text-gray-600">Nenhum cliente cadastrado.</p>
      ) : (
        <div className="grid gap-4">
          {clientes.map((cliente, index) => (
            <div key={index} className="bg-white p-4 rounded-xl shadow-md border">
              <p><strong>Nome:</strong> {cliente.nome}</p>
              <p><strong>CNPJ:</strong> {cliente.cnpj}</p>
              <p><strong>Email:</strong> {cliente.email}</p>
              <p><strong>Telefone:</strong> {cliente.telefone}</p>
              <p><strong>Endereço:</strong> {cliente.endereco}</p>
              {cliente.proprietario && <p><strong>Proprietário:</strong> {cliente.proprietario}</p>}
              {cliente.cpf && <p><strong>CPF:</strong> {cliente.cpf}</p>}
              {cliente.licencaAmbiental && <p><strong>Licença Ambiental:</strong> {cliente.licencaAmbiental}</p>}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
