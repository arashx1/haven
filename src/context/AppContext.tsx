import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { LANGUAGES, CONDITIONS, type Language, type TextScale, type CareCondition } from '@/data/catalog';
import i18n from '@/i18n';
import { supabase, isSupabaseConfigured, errorMessage } from '@/lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';

export type Route = 'my-day' | 'play' | 'memories' | 'memory-detail' | 'people' | 'person-detail' | 'help' | 'signup' | 'login' | 'onboarding' | 'caregiver-dashboard';
export type AuthState = 'guest' | 'authenticated';
export interface CareProfile { id: string; full_name: string; care_condition: CareCondition; timezone: string; }
const routes: Route[] = ['my-day','play','memories','memory-detail','people','person-detail','help','signup','login','onboarding','caregiver-dashboard'];
function readLocation() {
  const [name, query] = location.hash.slice(1).split('?');
  return { route: routes.includes(name as Route) ? name as Route : 'my-day' as Route, params: Object.fromEntries(new URLSearchParams(query)) };
}
function preference(key: string, fallback: string) { try { return localStorage.getItem(key) || fallback; } catch { return fallback; } }
interface AppState {
  route: Route; navigate: (route: Route, params?: Record<string,string>) => void; goBack: () => void;
  language: Language; setLanguage: (language: Language) => void;
  textScale: TextScale; setTextScale: (size: TextScale) => void;
  session: Session | null; authState: AuthState; authLoading: boolean; signOut: () => Promise<void>;
  patientName: string; careCondition: CareCondition; setCareCondition: (value: CareCondition) => Promise<void>;
  patientId: string; profiles: CareProfile[]; selectPatient: (id: string) => void; refreshProfiles: () => Promise<void>;
  timezone: string; profileError: string; updateProfile: (values: Partial<Pick<CareProfile,'full_name'|'care_condition'|'timezone'>>) => Promise<void>;
  isCaregiverMode: boolean; setCaregiverMode: (value: boolean) => void;
  selectedMemoryId: string | null; selectedPersonId: string | null;
  paywallOpen: boolean; openPaywall: () => void; closePaywall: () => void;
}
const AppContext = createContext<AppState | null>(null);
export function AppProvider({ children }: { children: ReactNode }) {
  const [locationState, setLocationState] = useState(readLocation);
  const [session, setSession] = useState<Session | null>(null);
  const currentUser = useRef<string | null>(null);
  currentUser.current = session?.user.id || null;
  const [authLoading, setAuthLoading] = useState(true);
  const [profiles, setProfiles] = useState<CareProfile[]>([]);
  const [patientId, setPatientId] = useState('');
  const [profileError, setProfileError] = useState('');
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [isCaregiverMode, setCaregiverMode] = useState(false);
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = preference('language','en');
    return LANGUAGES.some(l => l.code === saved) ? saved as Language : 'en';
  });
  const [textScale, setTextScaleState] = useState<TextScale>(() => Math.max(1,Math.min(4, Number(preference('haven_text_size','2')) || 2)) as TextScale);
  const navigate = useCallback((route: Route, params: Record<string,string> = {}) => {
    const search = new URLSearchParams(params).toString();
    location.hash = route + (search ? '?' + search : '');
    window.scrollTo({ top: 0 });
  }, []);
  useEffect(() => {
    const handler = () => setLocationState(readLocation());
    window.addEventListener('hashchange',handler);
    return () => window.removeEventListener('hashchange',handler);
  }, []);
  useEffect(() => {
    if (!isSupabaseConfigured) { setAuthLoading(false); return; }
    let alive = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, next) => {
      if (alive) { setSession(next); setAuthLoading(false); }
    });
    supabase.auth.getSession().then(({ data, error }) => {
      if (alive) { if (error) setProfileError(error.message); setSession(data.session); setAuthLoading(false); }
    }).catch(e => { if (alive) { setProfileError(errorMessage(e)); setAuthLoading(false); } });
    return () => { alive = false; subscription.unsubscribe(); };
  }, []);
  const refreshProfiles = useCallback(async () => {
    if (!session) return;
    const { data, error } = await supabase.from('profiles').select('id,full_name,care_condition,timezone').order('created_at');
    if (currentUser.current !== session.user.id) return;
    if (error) { setProfileError('Could not load care profiles: ' + error.message); return; }
    const available = (data || []) as CareProfile[];
    setProfiles(available);
    setPatientId(current => available.some(p => p.id === current) ? current : session.user.id);
    setProfileError(available.length ? '' : 'Your care profile is missing. Please contact the app administrator.');
  }, [session?.user.id]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    setProfiles([]); setPatientId(session?.user.id || ''); setPaywallOpen(false);
    setProfileError('');
    if (session) void refreshProfiles();
  }, [session?.user.id, refreshProfiles]); // eslint-disable-line react-hooks/exhaustive-deps
  const profile = profiles.find(p => p.id === patientId);
  const updateProfile = async (values: Partial<Pick<CareProfile,'full_name'|'care_condition'|'timezone'>>) => {
    if (!session || patientId !== session.user.id) throw new Error('Only the account owner can change these settings.');
    if (values.care_condition && !CONDITIONS.some(c => c.id === values.care_condition)) throw new Error('Choose a valid care focus.');
    if (values.timezone) new Intl.DateTimeFormat('en', { timeZone: values.timezone }).format();
    const { error } = await supabase.from('profiles').update(values).eq('id',patientId).select('id').single();
    if (error) throw error;
    await refreshProfiles();
  };
  useEffect(() => { i18n.changeLanguage(language); document.documentElement.lang = language; try { localStorage.setItem('language',language); } catch { /* preference storage unavailable */ } }, [language]);
  useEffect(() => {
    document.documentElement.classList.remove('text-scale-1','text-scale-2','text-scale-3','text-scale-4');
    document.documentElement.classList.add('text-scale-' + textScale);
    try { localStorage.setItem('haven_text_size',String(textScale)); } catch { /* preference storage unavailable */ }
  }, [textScale]);
  const signOut = async () => {
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) { setProfileError(error.message); return; }
    window.speechSynthesis?.cancel(); setSession(null); setProfiles([]); setPatientId(''); setPaywallOpen(false); navigate('login');
  };
  const value: AppState = {
    route: locationState.route, navigate, goBack: () => { if (history.length > 1) history.back(); else navigate('my-day'); },
    session, authState: session ? 'authenticated' : 'guest', authLoading, signOut,
    language, setLanguage: setLanguageState, textScale, setTextScale: setTextScaleState,
    patientName: profile?.full_name || session?.user.user_metadata?.full_name || '',
    careCondition: profile?.care_condition || 'dementia', setCareCondition: care_condition => updateProfile({care_condition}),
    patientId, profiles, selectPatient: id => { if (profiles.some(p => p.id === id)) { setPatientId(id); navigate('caregiver-dashboard'); } },
    refreshProfiles, profileError, updateProfile, timezone: profile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    isCaregiverMode, setCaregiverMode,
    selectedMemoryId: locationState.params.memoryId || null, selectedPersonId: locationState.params.personId || null,
    paywallOpen, openPaywall: () => setPaywallOpen(true), closePaywall: () => setPaywallOpen(false),
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
// eslint-disable-next-line react-refresh/only-export-components
export function useApp() { const context = useContext(AppContext); if (!context) throw new Error('AppProvider is missing.'); return context; }
