import { createClient } from '@supabase/supabase-js';

// Access environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string;

// Debugging output to verify environment variables
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_KEY);

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or Key is undefined');
}

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);
