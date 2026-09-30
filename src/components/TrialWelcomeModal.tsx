import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Crown, Sparkles, CheckCircle, X, ArrowRight } from 'lucide-react';
import { activateDemoSubscription, getSubscriptionTier } from '@/lib/revenuecat';

export function TrialWelcomeModal() {
  const { authState, patientName, openPaywall } = useApp();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (authState !== 'authenticated') return;

    // Check if user has already seen the welcome trial modal
    const alreadyShown = localStorage.getItem('haven_welcome_trial_shown');
    if (!alreadyShown) {
      // Automatically gift the 1-month trial upon new account login
      if (getSubscriptionTier(null) === 'free') {
        activateDemoSubscription('haven_plus');
      }
      // Brief delay so page finishes loading before modal animates in
      const timer = setTimeout(() => {
        setOpen(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [authState]);

  const handleClose = () => {
    localStorage.setItem('haven_welcome_trial_shown', 'true');
    setOpen(false);
  };

  const handleViewPlans = () => {
    handleClose();
    openPaywall();
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10001,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      {/* Backdrop */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)' }} />

      {/* Modal Card */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '520px',
          maxHeight: '92vh',
          overflowY: 'auto',
          margin: '1rem',
        }}
        className="bg-white rounded-3xl shadow-2xl animate-scaleIn border border-amber-200"
      >
        {/* Banner Header */}
        <div className="relative bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-6 rounded-t-3xl text-white text-center overflow-hidden">
          <button
            type="button"
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              padding: '6px',
              display: 'flex',
              color: 'white',
            }}
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3 shadow-warm">
            <Crown className="w-9 h-9 text-amber-100 animate-bounce" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/25 text-white text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            Special Welcome Gift
          </span>

          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white leading-tight">
            Your 1-Month Free Trial is Active! 🎉
          </h2>
          <p className="text-amber-100 text-sm mt-1.5 font-medium">
            Welcome to Haven, {patientName || 'friend'}! You have been gifted full access to Haven Plus.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* RevenueCat Badge */}
          <div className="flex items-center justify-center gap-2 py-1 px-3 bg-amber-50 border border-amber-200/80 rounded-full w-fit mx-auto mb-5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-amber-900">
              Subscriptions powered by <strong className="font-bold">RevenueCat Web SDK</strong>
            </span>
          </div>

          <p className="text-ink-600 text-sm text-center mb-4 leading-relaxed">
            Everything you need for gentle memory support, stress-free routines, and family care is ready for the next 30 days:
          </p>

          <div className="bg-cream-50 rounded-2xl p-4 border border-cream-200 mb-5 space-y-2.5">
            <div className="flex items-center gap-3 text-ink-700 text-sm">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              <span><strong>All 10 Mind & Relaxation Games</strong> unlocked</span>
            </div>
            <div className="flex items-center gap-3 text-ink-700 text-sm">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              <span><strong>Unlimited Daily Reminders</strong> &amp; personalized schedule</span>
            </div>
            <div className="flex items-center gap-3 text-ink-700 text-sm">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              <span><strong>Unlimited Family Memories</strong> &amp; photo album</span>
            </div>
            <div className="flex items-center gap-3 text-ink-700 text-sm">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              <span><strong>Full Caregiver Portal Access</strong> for peace of mind</span>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 text-center mb-5">
            <p className="text-xs font-bold text-emerald-900">
              🎁 100% Free for 30 Days · No Credit Card Required
            </p>
            <p className="text-[11px] text-emerald-700 mt-0.5">
              Automatically stops after 30 days unless you choose to renew. Zero unexpected charges.
            </p>
          </div>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleClose}
              className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2 shadow-warm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold"
            >
              <span>Start Exploring Haven</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleViewPlans}
              className="btn-secondary w-full py-2.5 text-sm text-ink-600 font-semibold"
            >
              View Subscription Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
