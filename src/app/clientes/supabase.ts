// src/lib/clientes.service.ts
import { supabase } from './supabase';

export async function salvarCliente({
  nome,
  cnpj,
  endereco,
  proprietario
}: {
  nome: string;
  cnpj: string;
  endereco: string;
  proprietario: string;
}) {
  const { data, error } = await supabase
    .from('clientes')
    .insert([{ nome, cnpj, endereco, proprietario }]);

  if (error) throw new Error(error.message);

  return data;
}
