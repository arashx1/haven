import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { type Language, type TextScale, type CareCondition } from '@/data/mockData';
import i18n from '@/i18n';
import { supabase } from '@/lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';
import { initRevenueCat } from '@/lib/revenuecat';

export type Route =
  | 'my-day'
  | 'play'
  | 'memories'
  | 'memory-detail'
  | 'people'
  | 'person-detail'
  | 'help'
  | 'reminder'
  | 'signup'
  | 'login'
  | 'onboarding'
  | 'caregiver-dashboard'
  | 'demo';

export type AuthState = 'guest' | 'authenticated' | 'onboarding';

export type OnboardingStep = 0 | 1 | 2 | 3 | 4 | 5;

interface AppState {
  route: Route;
  navigate: (route: Route, params?: Record<string, string>) => void;
  goBack: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  textScale: TextScale;
  setTextScale: (scale: TextScale) => void;
  selectedMemoryId: string | null;
  selectedPersonId: string | null;
  activeReminderId: string | null;
  setActiveReminderId: (id: string | null) => void;
  patientName: string;
  setPatientName: (name: string) => void;
  authState: AuthState;
  setAuthState: (state: AuthState) => void;
  onboardingStep: OnboardingStep;
  setOnboardingStep: (step: OnboardingStep) => void;
  isCaregiverMode: boolean;
  setCaregiverMode: (val: boolean) => void;
  session: Session | null;
  authLoading: boolean;
  signOut: () => Promise<void>;
  loginWithDemo: (usernameOrEmail?: string) => void;
  careCondition: CareCondition;
  setCareCondition: (c: CareCondition) => void;
  // Auth gate modal (for demo mode feature lock)
  authGateOpen: boolean;
  authGateFeature: string;
  openAuthGate: (feature?: string) => void;
  closeAuthGate: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>('login');
  const [, setHistory] = useState<Route[]>([]);
  const [params, setParams] = useState<Record<string, string>>({});
  const [language, setLanguage] = useState<Language>('en');
  const [textScale, setTextScale] = useState<TextScale>(2);
  const [activeReminderId, setActiveReminderId] = useState<string | null>(null);
  const [patientName, setPatientName] = useState('');
  const [authState, setAuthState] = useState<AuthState>('guest');
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>(0);
  const [isCaregiverMode, setIsCaregiverMode] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authGateOpen, setAuthGateOpen] = useState(false);
  const [authGateFeature, setAuthGateFeature] = useState('');
  const [careCondition, setCareConditionState] = useState<CareCondition>(() => {
    return (localStorage.getItem('haven_care_condition') as CareCondition) || 'dementia';
  });

  const setCareCondition = (c: CareCondition) => {
    setCareConditionState(c);
    localStorage.setItem('haven_care_condition', c);
  };

  // Pull the display name from the profiles table (created automatically
  // on signup by a DB trigger — see supabase/schema.sql).
  const loadProfile = async (userId: string, fallbackName?: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .maybeSingle();
    if (data?.full_name) {
      setPatientName(data.full_name);
    } else if (fallbackName) {
      setPatientName(fallbackName);
    }
  };

  // Check for existing demo user or Supabase session on load
  useEffect(() => {
    let active = true;

    // First check local demo user storage
    const savedDemo = localStorage.getItem('haven_demo_user');
    if (savedDemo) {
      try {
        const parsed = JSON.parse(savedDemo);
        if (parsed?.name) {
          setPatientName(parsed.name);
          setAuthState('authenticated');
          setRoute('my-day');
          setSession({
            access_token: 'demo-token',
            user: {
              id: 'demo-user',
              email: parsed.email || 'demo@haven.app',
              user_metadata: { full_name: parsed.name },
            },
          } as unknown as Session);
          setAuthLoading(false);
          return;
        }
      } catch {
        // ignore malformed stored demo user
      }
    }

    supabase.auth
      .getSession()
      .then(({ data: { session: initialSession } }) => {
        if (!active) return;
        setSession(initialSession);
        if (initialSession) {
          setAuthState('authenticated');
          setRoute('my-day');
          loadProfile(initialSession.user.id, initialSession.user.user_metadata?.full_name);
          initRevenueCat(initialSession.user.id);
        }
        setAuthLoading(false);
      })
      .catch(() => {
        if (active) setAuthLoading(false);
      });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) {
        localStorage.removeItem('haven_demo_user');
        setAuthState((prev) => (prev === 'onboarding' ? prev : 'authenticated'));
        loadProfile(newSession.user.id, newSession.user.user_metadata?.full_name);
        initRevenueCat(newSession.user.id);
      } else {
        const hasDemo = localStorage.getItem('haven_demo_user');
        if (!hasDemo) {
          setAuthState('guest');
          setPatientName('');
        }
      }
    });

    return () => {
      active = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('text-scale-1', 'text-scale-2', 'text-scale-3', 'text-scale-4');
    root.classList.add(`text-scale-${textScale}`);
  }, [textScale]);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  const navigate = (newRoute: Route, newParams: Record<string, string> = {}) => {
    setHistory((h) => [...h, route]);
    setRoute(newRoute);
    setParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setHistory((h) => {
      if (h.length === 0) {
        setRoute('my-day');
        return h;
      }
      const prev = h[h.length - 1];
      setRoute(prev);
      return h.slice(0, -1);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginWithDemo = (usernameOrEmail?: string) => {
    let cleanName = (usernameOrEmail || 'Elena Vance').trim();
    if (cleanName.includes('@')) {
      cleanName = cleanName.split('@')[0];
    }
    const formattedName =
      cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

    const email = usernameOrEmail?.includes('@')
      ? usernameOrEmail
      : `${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'user'}@haven.app`;

    const demoUser = {
      id: 'demo-user-123',
      email,
      user_metadata: { full_name: formattedName },
    };

    const demoSession = {
      access_token: 'haven-demo-session-token',
      user: demoUser,
    } as unknown as Session;

    localStorage.setItem(
      'haven_demo_user',
      JSON.stringify({ name: formattedName, email })
    );

    setSession(demoSession);
    setPatientName(formattedName);
    setAuthState('authenticated');
    setIsCaregiverMode(false);
    setRoute('my-day');
  };

  const signOut = async () => {
    localStorage.removeItem('haven_demo_user');
    localStorage.removeItem('haven_mock_session');
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore signOut error
    }
    setSession(null);
    setPatientName('');
    setAuthState('guest');
    setIsCaregiverMode(false);
    setHistory([]);
    setAuthGateOpen(false);
    setRoute('login');
  };

  const openAuthGate = (feature = 'use this feature') => {
    setAuthGateFeature(feature);
    setAuthGateOpen(true);
  };

  const closeAuthGate = () => {
    setAuthGateOpen(false);
    setAuthGateFeature('');
  };

  const value: AppState = {
    route,
    navigate,
    goBack,
    language,
    setLanguage,
    textScale,
    setTextScale,
    selectedMemoryId: params.memoryId ?? null,
    selectedPersonId: params.personId ?? null,
    activeReminderId,
    setActiveReminderId,
    patientName,
    setPatientName,
    authState,
    setAuthState,
    onboardingStep,
    setOnboardingStep,
    isCaregiverMode,
    setCaregiverMode: setIsCaregiverMode,
    session,
    authLoading,
    signOut,
    loginWithDemo,
    authGateOpen,
    authGateFeature,
    openAuthGate,
    closeAuthGate,
    careCondition,
    setCareCondition,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
