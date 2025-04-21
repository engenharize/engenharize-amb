'use client';

import { useEffect, useState } from 'react';

interface Cliente {
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
}

export default function ListaClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    const dados = localStorage.getItem('clientes');
    if (dados) {
      setClientes(JSON.parse(dados));
    }
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
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
