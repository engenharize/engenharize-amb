import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xxxx.supabase.co'; // Substitua pela sua URL
const supabaseKey = 'sua-chave-anon-public';    // Substitua pela sua chave
export const supabase = createClient(supabaseUrl, supabaseKey);

// Função para salvar um cliente
export const salvarCliente = async (cliente: {
  nome: string;
  cnpj: string;
  endereco: string;
  proprietario: string;
}) => {
  const { error } = await supabase.from('clientes').insert([cliente]);
  if (error) throw new Error(error.message);
};

// ✅ Função para buscar clientes do Supabase
export const buscarClientes = async () => {
  const { data, error } = await supabase.from('clientes').select('*');
  if (error) throw new Error(error.message);
  return data;
};
