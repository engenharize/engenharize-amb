'use client';

import { useState } from 'react';

export default function CadastrarCliente() {
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clientesSalvos = localStorage.getItem('clientes');
    const lista = clientesSalvos ? JSON.parse(clientesSalvos) : [];
    const novaLista = [...lista, formData];
    localStorage.setItem('clientes', JSON.stringify(novaLista));
    alert('Cliente cadastrado com sucesso!');
    setFormData({
      nome: '',
      cnpj: '',
      email: '',
      telefone: '',
      endereco: '',
    });
  };

  return (
    <main className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Cadastrar Cliente</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm space-y-4"
      >
        <input
          type="text"
          name="nome"
          placeholder="Nome da Empresa"
          value={formData.nome}
          onChange={handleChange}
          required
          className="w-full p-2 border border-green-300 rounded"
        />
        <input
          type="text"
          name="cnpj"
          placeholder="CNPJ"
          value={formData.cnpj}
          onChange={handleChange}
          required
          className="w-full p-2 border border-green-300 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border border-green-300 rounded"
        />
        <input
          type="text"
          name="telefone"
          placeholder="Telefone"
          value={formData.telefone}
          onChange={handleChange}
          className="w-full p-2 border border-green-300 rounded"
        />
        <input
          type="text"
          name="endereco"
          placeholder="Endereço completo"
          value={formData.endereco}
          onChange={handleChange}
          className="w-full p-2 border border-green-300 rounded"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white font-medium py-2 rounded hover:bg-green-700 transition"
        >
          Salvar Cliente
        </button>
      </form>
      <button
  type="button"
  onClick={() => window.location.href = '/dashboard'}
  className="mt-6 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded transition"
>
  ⬅ Voltar à Página Inicial
</button>
    </main>
  );
}
