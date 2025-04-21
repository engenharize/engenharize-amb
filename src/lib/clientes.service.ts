import { supabase as supabaseClient } from './supabase';

interface ClienteData {
  nome: string;
  cnpj: string;
  endereco: string;
  proprietario: string;
}

export async function salvarCliente(data: ClienteData) {
  const { error } = await supabaseClient.from('clientes').insert([data]);
  if (error) throw new Error(error.message);
}

export async function buscarClientes() {
  const { data, error } = await supabaseClient.from('clientes').select('*');
  if (error) throw new Error(error.message);
  return data;
}

export async function buscarClientePorNome(nome: string) {
  const { data, error } = await supabaseClient
    .from('clientes')
    .select('*')
    .eq('nome', nome)
    .single();

  if (error) throw new Error(error.message);
  return data;
}
