import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ulyddhlseivodhqotmvv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ruHGaczwpePZkFoTsL4bxA__nKrDQP_';

const checkConfigured = (url?: string, key?: string): boolean => {
  if (!url || !key) return false;
  if (url.includes('placeholder') || key.includes('placeholder')) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol.startsWith('http') && parsed.hostname.includes('.');
  } catch {
    return false;
  }
};

export const isSupabaseConfigured = checkConfigured(supabaseUrl, supabaseAnonKey);

/**
 * Lightweight mock client that guarantees zero crashes and full offline / GitHub review support
 * when Supabase keys are not provided.
 */
function createMockClient(): SupabaseClient {
  return {
    auth: {
      async getSession() {
        const saved = localStorage.getItem('haven_mock_session');
        if (saved) {
          try {
            return { data: { session: JSON.parse(saved) }, error: null };
          } catch {
            // ignore malformed stored session
          }
        }
        return { data: { session: null }, error: null };
      },
      async getUser() {
        const saved = localStorage.getItem('haven_mock_session');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            return { data: { user: parsed.user }, error: null };
          } catch {
            // ignore malformed stored user
          }
        }
        return { data: { user: null }, error: null };
      },
      onAuthStateChange(callback: (event: string, session: unknown) => void) {
        const handler = (e: StorageEvent) => {
          if (e.key === 'haven_mock_session') {
            const sess = e.newValue ? JSON.parse(e.newValue) : null;
            callback('SIGNED_IN', sess);
          }
        };
        window.addEventListener('storage', handler);
        return {
          data: {
            subscription: {
              unsubscribe: () => window.removeEventListener('storage', handler),
            },
          },
        };
      },
      async signInWithPassword({ email }: { email?: string; password?: string }) {
        const username = email?.split('@')[0] || email || 'Elena';
        const mockUser = {
          id: 'demo-user-123',
          email,
          user_metadata: { full_name: username },
        };
        const mockSession = {
          access_token: 'mock-token',
          user: mockUser,
        };
        localStorage.setItem('haven_mock_session', JSON.stringify(mockSession));
        return { data: { user: mockUser, session: mockSession }, error: null };
      },
      async signUp({ email, options }: { email?: string; password?: string; options?: { data?: { full_name?: string } } }) {
        const fullName = options?.data?.full_name || email?.split('@')[0] || 'Elena';
        const mockUser = {
          id: 'demo-user-123',
          email,
          user_metadata: { full_name: fullName },
        };
        const mockSession = {
          access_token: 'mock-token',
          user: mockUser,
        };
        localStorage.setItem('haven_mock_session', JSON.stringify(mockSession));
        return { data: { user: mockUser, session: mockSession }, error: null };
      },
      async signOut() {
        localStorage.removeItem('haven_mock_session');
        return { error: null };
      },
    },
    from: () => {
      const chain: Record<string, unknown> = {
        select: () => chain,
        insert: () => chain,
        update: () => chain,
        delete: () => chain,
        eq: () => chain,
        order: () => chain,
        maybeSingle: async () => ({ data: null, error: null }),
        single: async () => ({ data: null, error: null }),
        then: (resolve: (val: unknown) => void) => resolve({ data: [], error: null }),
      };
      return chain;
    },
  } as unknown as SupabaseClient;
}

let activeClient: SupabaseClient;

if (isSupabaseConfigured) {
  try {
    activeClient = createClient(supabaseUrl!, supabaseAnonKey!);
  } catch (err) {
    console.warn('Error creating Supabase client, falling back to mock client:', err);
    activeClient = createMockClient();
  }
} else {
  console.info('No Supabase credentials detected. Running Haven in resilient Offline/Demo mode.');
  activeClient = createMockClient();
}

export const supabase = activeClient;