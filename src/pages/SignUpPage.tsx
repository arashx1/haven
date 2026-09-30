import { useApp } from '@/context/AppContext';
import { LANGUAGES, type Language } from '@/data/mockData';
import { useState } from 'react';
import { UserPlus, Eye, EyeOff, Check, ChevronDown, Globe, Sparkles } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { TopBar } from '@/components/TopBar';

export function SignUpPage() {
  const { navigate, setOnboardingStep, setPatientName, language, setLanguage, loginWithDemo } = useApp();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<Language>(language);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (!password) {
      setError('Please choose a password.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Your passwords do not match. Please try again.');
      return;
    }
    if (password.length < 6) {
      setError('Your password is too short. Please use at least 6 characters.');
      return;
    }

    setLoading(true);

    if (isSupabaseConfigured) {
      try {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: fullName.trim() } },
        });

        if (signUpError) {
          setLoading(false);
          setError(signUpError.message);
          return;
        }

        if (data?.user) {
          localStorage.removeItem('haven_demo_user');
          setLoading(false);
          setLanguage(preferredLanguage);
          setPatientName(fullName.trim());
          setOnboardingStep(0);
          navigate('onboarding');
          return;
        }
      } catch (err: unknown) {
        console.warn('Supabase network error, continuing with local session:', err);
      }
    }

    // Zero-friction demo account creation for hackathon review & offline usage
    setLoading(false);
    setLanguage(preferredLanguage);
    loginWithDemo(fullName.trim());
    setOnboardingStep(0);
    navigate('onboarding');
  };

  const currentLang = LANGUAGES.find((l) => l.code === preferredLanguage) || LANGUAGES[0];

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      <TopBar />
      <div className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="card-base p-6 sm:p-8 max-w-md w-full animate-scaleIn border border-cream-200 shadow-lift">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-honey-400 to-honey-600 flex items-center justify-center shadow-warm">
              <span className="text-white font-display font-extrabold text-2xl">H</span>
            </div>
            <h1 className="section-title text-3xl mb-1">Create your account</h1>
            <p className="text-ink-500 text-lg">Let's get started together with Haven.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-base sm:text-lg font-bold text-ink-700 mb-1.5">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="e.g. Elena Vance"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-2xl border-2 border-cream-300 bg-white px-4 py-3.5 text-base sm:text-lg focus:border-honey-400 focus:outline-none transition"
              />
            </div>

            <div>
              <label htmlFor="signupEmail" className="block text-base sm:text-lg font-bold text-ink-700 mb-1.5">
                Email
              </label>
              <input
                id="signupEmail"
                type="email"
                autoComplete="email"
                placeholder="e.g. elena@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border-2 border-cream-300 bg-white px-4 py-3.5 text-base sm:text-lg focus:border-honey-400 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-base sm:text-lg font-bold text-ink-700 mb-1.5">Preferred Language</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLangOpen((o) => !o)}
                  className="w-full flex items-center justify-between rounded-2xl border-2 border-cream-300 bg-white px-4 py-3.5 text-base sm:text-lg focus:border-honey-400 focus:outline-none transition"
                >
                  <span className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-honey-600" />
                    {currentLang?.nativeLabel} ({currentLang?.label})
                  </span>
                  <ChevronDown className={`w-5 h-5 text-ink-400 transition ${langOpen ? 'rotate-180' : ''}`} />
                </button>
                {langOpen && (
                  <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-lift border border-cream-200 py-2 z-20 animate-scaleIn origin-top max-h-60 overflow-y-auto">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setPreferredLanguage(lang.code as Language);
                          setLangOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-cream-100 transition text-left"
                      >
                        <div>
                          <p className="font-bold text-ink-800 text-base">{lang.nativeLabel}</p>
                          <p className="text-xs text-ink-400">{lang.label}</p>
                        </div>
                        {preferredLanguage === lang.code && <Check className="w-5 h-5 text-honey-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="signupPassword" className="block text-base sm:text-lg font-bold text-ink-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="signupPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border-2 border-cream-300 bg-white px-4 py-3.5 pr-12 text-base sm:text-lg focus:border-honey-400 focus:outline-none transition"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-base sm:text-lg font-bold text-ink-700 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-2xl border-2 border-cream-300 bg-white px-4 py-3.5 pr-12 text-base sm:text-lg focus:border-honey-400 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-ink-400 hover:text-ink-600"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-coral-600 font-semibold text-sm bg-coral-50 rounded-xl px-4 py-2.5">{error}</p>
            )}

            {success && (
              <p className="text-sage-700 font-semibold text-sm bg-sage-50 rounded-xl px-4 py-2.5">{success}</p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full text-lg sm:text-xl py-3.5 shadow-warm">
              <UserPlus className="w-5 h-5" />
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-ink-500 text-base">Already have an account?</p>
            <button
              onClick={() => navigate('login')}
              className="text-honey-600 font-bold text-base hover:text-honey-700 transition mt-0.5"
            >
              Log in
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cream-200" />
            </div>
            <span className="relative bg-white px-3 text-xs text-ink-400 font-semibold uppercase tracking-wider">
              or explore first
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate('demo')}
            className="w-full bg-cream-100 hover:bg-cream-200 text-ink-700 font-bold py-3 px-3 rounded-2xl flex items-center justify-center gap-1.5 text-sm transition"
          >
            <Sparkles className="w-4 h-4 text-honey-600" />
            Take the Interactive Feature Tour
          </button>
        </div>
      </div>
    </div>
  );
}
