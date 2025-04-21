import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mbdsxzcmxdhvbazpfxcs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1iZHN4emNteGRodmJhenBmeGNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNjM4NzIsImV4cCI6MjA2MDgzOTg3Mn0.SYp6AV07CTZtvkYz6P6Yue8fvAFHzWT95JR1RnYlxyM';

export const supabase = createClient(supabaseUrl, supabaseKey);
