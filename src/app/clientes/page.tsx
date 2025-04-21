'use client';

import { useState } from 'react';

export default function CadastrarCliente() {
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
    proprietario: '',
    cpf: '',
    licencaAmbiental: '',
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
      proprietario: '',
      cpf: '',
      licencaAmbiental: '',
    });
  };

  return (
    <main className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Cadastrar Cliente</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm space-y-4"
      >
        {[
          { name: 'nome', placeholder: 'Nome da Empresa', required: true },
          { name: 'proprietario', placeholder: 'Proprietário' },
          { name: 'cpf', placeholder: 'CPF do Proprietário' },
          { name: 'licencaAmbiental', placeholder: 'Licença Ambiental' },
          { name: 'cnpj', placeholder: 'CNPJ', required: true },
          { name: 'email', placeholder: 'E-mail', type: 'email' },
          { name: 'telefone', placeholder: 'Telefone' },
          { name: 'endereco', placeholder: 'Endereço completo' },
        ].map(({ name, placeholder, required = false, type = 'text' }) => (
          <input
            key={name}
            type={type}
            name={name}
            placeholder={placeholder}
            value={formData[name as keyof typeof formData]}
            onChange={handleChange}
            required={required}
            className="w-full p-2 border border-green-300 rounded text-green-800"
          />
        ))}

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
