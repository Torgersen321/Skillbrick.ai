import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from root .env file
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY; // Using Anon key for now
// const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use if admin operations needed

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided in environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).');
}

// Note: If using Anon key, ensure RLS policies are set up correctly in Supabase
// to allow authenticated users to access/modify their own data.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// If you need admin privileges for some backend operations:
// export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey); 