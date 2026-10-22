import { createClient } from '@supabase/supabase-js';
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const isSupabaseConfigured = Boolean(url && key && /^https:\/\//.test(url));
// App blocks authenticated screens if configuration is missing.
export const supabase = createClient(url || 'https://unconfigured.invalid', key || 'unconfigured');
export function errorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) return String(error.message);
  return 'The request could not be completed. Check your connection and try again.';
}
