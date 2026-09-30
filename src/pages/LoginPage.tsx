import { useApp } from '@/context/AppContext';
import { useState } from 'react';
import { LogIn, Eye, EyeOff, Sun, Sparkles, Zap } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { TopBar } from '@/components/TopBar';
import { useTranslation } from 'react-i18next';

export function LoginPage() {
  const { navigate, loginWithDemo } = useApp();
  const { t } = useTranslation();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const input = emailOrUsername.trim();
    if (!input) {
      setError(t('enterEmailOrUsername', 'Please enter your username or email.'));
      return;
    }

    setLoading(true);

    // If Supabase is configured and input looks like an email, attempt cloud authentication
    if (isSupabaseConfigured && input.includes('@')) {
      try {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: input,
          password: password || 'demo123',
        });

        if (!signInError) {
          localStorage.removeItem('haven_demo_user');
          setLoading(false);
          navigate('my-day');
          return;
        }

        if (password) {
          setLoading(false);
          setError(signInError.message);
          return;
        }
        console.warn('Supabase sign-in notice:', signInError.message, '- Continuing in Demo Mode');
      } catch (err: unknown) {
        console.warn('Supabase network error, continuing in Demo Mode:', err);
      }
    }

    // Zero-friction fallback: Sign in immediately with the entered username or email
    setLoading(false);
    loginWithDemo(input);
  };

  const handleQuickDemo = () => {
    loginWithDemo('Elena Vance');
  };

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      {/* Top bar with Haven logo, Feature Tour, Font Size A- / A+, and Language selector */}
      <TopBar />

      <div className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="card-base p-6 sm:p-8 max-w-md w-full animate-scaleIn border border-cream-200 shadow-lift">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-honey-400 to-honey-600 flex items-center justify-center shadow-warm">
              <Sun className="w-9 h-9 text-white" />
            </div>
            <h1 className="section-title text-3xl mb-1">{t('welcomeBack', 'Welcome back')}</h1>
            <p className="text-ink-500 text-base sm:text-lg">
              {t('happyToSeeYou', "We're happy to see you again.")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="loginInput" className="block text-base sm:text-lg font-bold text-ink-700 mb-1.5">
                {t('emailOrUsername', 'Email or Username')}
              </label>
              <input
                id="loginInput"
                type="text"
                autoComplete="username"
                placeholder="e.g. Elena Vance or elena@example.com"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                className="w-full rounded-2xl border-2 border-cream-300 bg-white px-4 py-3.5 text-base sm:text-lg focus:border-honey-400 focus:outline-none transition shadow-xs"
              />
            </div>

            <div>
              <label htmlFor="loginPassword" className="block text-base sm:text-lg font-bold text-ink-700 mb-1.5">
                {t('password', 'Password')}
              </label>
              <div className="relative">
                <input
                  id="loginPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter password (optional in demo)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border-2 border-cream-300 bg-white px-4 py-3.5 pr-12 text-base sm:text-lg focus:border-honey-400 focus:outline-none transition shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-ink-400 hover:text-ink-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-coral-600 font-semibold text-sm bg-coral-50 rounded-xl px-4 py-2.5">{error}</p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full text-lg sm:text-xl py-3.5 shadow-warm">
              <LogIn className="w-5 h-5" />
              {loading ? 'Logging in…' : t('logIn', 'Log In')}
            </button>

            {/* Quick 1-Click Demo Login Button for Judges and Hackathon Reviewers */}
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full bg-sage-50 hover:bg-sage-100 border-2 border-sage-300 text-sage-800 font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 text-base transition active:scale-98 shadow-xs"
              title="Instantly login as demo patient Elena Vance without filling details"
            >
              <Zap className="w-4 h-4 text-sage-600 fill-sage-500" />
              <span>{t('quickDemoLogin', '⚡ Quick Demo Login (Elena Vance)')}</span>
            </button>
          </form>

          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => navigate('signup')}
              className="text-honey-600 font-bold text-base hover:text-honey-700 transition"
            >
              {t('createAccount', 'Create an account')}
            </button>
            <button
              onClick={() => setError('You can log in directly with any username in Demo Mode!')}
              className="text-ink-400 font-semibold text-sm hover:text-ink-600 transition"
            >
              {t('forgotPassword', 'Forgot password?')}
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cream-200" />
            </div>
            <span className="relative bg-white px-3 text-xs text-ink-400 font-semibold uppercase tracking-wider">
              or preview features
            </span>
          </div>

          {/* Interactive Tour */}
          <button
            type="button"
            onClick={() => navigate('demo')}
            className="w-full bg-gradient-to-r from-honey-50 to-amber-50 hover:from-honey-100 hover:to-amber-100 border-2 border-honey-200 text-honey-800 font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 text-sm sm:text-base transition active:scale-98 shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-honey-600" />
            {t('tourPrompt', 'Take the Interactive Feature Tour')}
          </button>
        </div>
      </div>
    </div>
  );
}
