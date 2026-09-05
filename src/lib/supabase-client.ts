import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://jcfqwlsqslaksnwderia.supabase.co";

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjZnF3bHNxc2xha3Nud2RlcmlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyNzgxNDMsImV4cCI6MjEwMjg1NDE0M30.aQYXWPQtQ7O9ZuBRLpfWsyyTl9GJt78Ivla66N6uDKs";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
