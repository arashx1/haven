import { useApp } from '@/context/AppContext';
import { UserPlus, LogIn, Lock, X, Sparkles, ShieldCheck } from 'lucide-react';

export function AuthGateModal() {
  const { authGateOpen, authGateFeature, closeAuthGate, navigate } = useApp();

  if (!authGateOpen) return null;

  const handleSignUp = () => {
    closeAuthGate();
    navigate('signup');
  };

  const handleLogin = () => {
    closeAuthGate();
    navigate('login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="card-base max-w-md w-full p-6 sm:p-8 bg-white border-2 border-honey-300 shadow-lift relative animate-scaleIn text-center"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={closeAuthGate}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-cream-100 hover:bg-cream-200 flex items-center justify-center text-ink-400 hover:text-ink-700 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-honey-400 to-coral-500 flex items-center justify-center shadow-warm">
          <Lock className="w-8 h-8 text-white" />
        </div>

        {/* Title */}
        <h2 className="section-title text-2xl sm:text-3xl text-ink-900 mb-2">
          Sign Up to Unlock Feature
        </h2>

        {/* Tagline */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-honey-100 text-honey-800 font-bold text-xs uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 text-honey-600" />
          Preview / Demo Mode
        </div>

        {/* Explanation */}
        <p className="text-ink-600 text-base sm:text-lg mb-6 leading-relaxed">
          You are currently previewing Haven. To{' '}
          <strong className="text-ink-900 font-bold">
            {authGateFeature || 'use interactive features'}
          </strong>{' '}
          and save your personalized routine safely, please create a free account or log in.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleSignUp}
            className="btn-primary w-full text-lg sm:text-xl py-3.5 flex items-center justify-center gap-2 shadow-warm"
          >
            <UserPlus className="w-5 h-5" />
            <span>Create Free Account</span>
          </button>

          <button
            onClick={handleLogin}
            className="btn-secondary w-full text-lg py-3 flex items-center justify-center gap-2 border-2 border-cream-300"
          >
            <LogIn className="w-5 h-5" />
            <span>Log In to Existing Account</span>
          </button>

          <button
            onClick={closeAuthGate}
            className="w-full text-ink-400 hover:text-ink-600 font-semibold text-sm pt-2 transition"
          >
            Continue Browsing Preview
          </button>
        </div>

        <div className="mt-5 pt-4 border-t border-cream-200 flex items-center justify-center gap-1.5 text-xs text-ink-400">
          <ShieldCheck className="w-4 h-4 text-sage-600" />
          <span>Your data will be private & cloud-synced</span>
        </div>
      </div>
    </div>
  );
}
