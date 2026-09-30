import { useState, useEffect } from 'react';
import { X, Star, Heart, Users, Zap, CheckCircle, RefreshCw, Loader, Sparkles } from 'lucide-react';
import {
  getOfferings,
  purchasePackage,
  restorePurchases,
  getSubscriptionTier,
  activateDemoSubscription,
  type SubscriptionTier,
} from '@/lib/revenuecat';
import type { Offerings, Package } from '@revenuecat/purchases-js';

interface PaywallProps {
  onClose: () => void;
  onSuccess?: () => void;
  featureName?: string;
}

const PLAN_FEATURES = {
  free: [
    'Daily reminders (up to 5)',
    'Memory album (up to 10 photos)',
    'Basic cognitive games',
    'Family recognition helper',
  ],
  haven_plus: [
    'Unlimited reminders',
    'Unlimited memory album',
    'All cognitive games + new releases',
    'Caregiver dashboard access',
    'Multi-language support (7 languages)',
    'Priority support',
  ],
  haven_family: [
    'Everything in Haven Plus',
    'Up to 5 family members / caregivers',
    'Shared memory albums',
    'Caregiver activity reports',
    'Emergency contact alerts',
    'Dedicated family support line',
  ],
};

export function PaywallModal({ onClose, onSuccess, featureName }: PaywallProps) {
  const [offerings, setOfferings] = useState<Offerings | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [error, setError] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  const [successPlan, setSuccessPlan] = useState<string | null>(null);
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>('free');

  useEffect(() => {
    setCurrentTier(getSubscriptionTier(null));
    getOfferings().then((o) => {
      setOfferings(o);
      setLoading(false);
    });
  }, []);

  const handlePurchase = async (pkg: Package, planName: string) => {
    setError('');
    setPurchasing(pkg.identifier);
    const result = await purchasePackage(pkg);
    setPurchasing(null);
    if (result.success && result.customerInfo) {
      const tier = getSubscriptionTier(result.customerInfo);
      console.info('[RevenueCat] Purchase successful, tier:', tier);
      setSuccessPlan(planName);
      onSuccess?.();
    } else if (result.error && result.error !== 'cancelled') {
      setError(result.error);
    }
  };

  const handleSelectPlan = async (
    planId: 'haven_plus' | 'haven_family',
    planName: string,
    matchedPkg?: Package
  ) => {
    setError('');
    setPurchasing(planId);

    // If live RevenueCat SDK is configured and has offerings
    if (matchedPkg && !isDemoMode) {
      await handlePurchase(matchedPkg, planName);
      return;
    }

    // In demo / hackathon simulation mode: activate 1-month trial with delightful feedback
    setTimeout(() => {
      activateDemoSubscription(planId);
      setCurrentTier(planId);
      setPurchasing(null);
      setSuccessPlan(planName);
      onSuccess?.();
    }, 800);
  };

  const handleRestore = async () => {
    setRestoring(true);
    setError('');
    const info = await restorePurchases();
    setRestoring(false);
    if (info) {
      const tier = getSubscriptionTier(info);
      if (tier !== 'free') {
        setCurrentTier(tier);
        onSuccess?.();
        onClose();
      } else {
        setError('No active subscription found to restore.');
      }
    } else {
      // In demo mode: restore active local demo subscription if any
      const localTier = getSubscriptionTier(null);
      if (localTier !== 'free') {
        setCurrentTier(localTier);
        setError('');
      } else {
        setError('No active subscription found to restore.');
      }
    }
  };

  // Show demo paywall when RevenueCat isn't configured
  const isDemoMode = !offerings && !loading;

  const plans = [
    {
      id: 'haven_plus',
      name: 'Haven Plus',
      icon: <Star className="w-5 h-5" />,
      color: 'from-honey-400 to-honey-600',
      textColor: 'text-honey-700',
      borderColor: 'border-honey-400',
      bgColor: 'bg-honey-50',
      monthlyPrice: '$4.99',
      annualPrice: '$39.99',
      annualMonthly: '$3.33',
      savings: 'Save 33%',
      features: PLAN_FEATURES.haven_plus,
      popular: true,
    },
    {
      id: 'haven_family',
      name: 'Haven Family',
      icon: <Users className="w-5 h-5" />,
      color: 'from-sage-400 to-sage-600',
      textColor: 'text-sage-700',
      borderColor: 'border-sage-400',
      bgColor: 'bg-sage-50',
      monthlyPrice: '$9.99',
      annualPrice: '$79.99',
      annualMonthly: '$6.67',
      savings: 'Save 33%',
      features: PLAN_FEATURES.haven_family,
      popular: false,
    },
  ];

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />

      {/* Modal */}
      <div
        style={{ position: 'relative', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', margin: '1rem' }}
        className="bg-white rounded-3xl shadow-2xl animate-scaleIn"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-honey-400 to-coral-500 p-6 rounded-t-3xl text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 50%)' }} />
          <button
            type="button"
            onClick={onClose}
            style={{ position: 'absolute', top: '1rem', right: '1rem', cursor: 'pointer', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', padding: '6px', display: 'flex', color: 'white' }}
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold">Upgrade Haven</h2>
              {featureName && <p className="text-white/80 text-sm">Unlock "{featureName}" and more</p>}
            </div>
          </div>
          <p className="text-white/90 text-sm leading-relaxed">
            Give your loved one the full Haven experience — unlimited memories, all games, and caregiver tools built for families.
          </p>
        </div>

        <div className="p-6">
          {successPlan ? (
            <div className="py-6 px-2 text-center animate-scaleIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-soft">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold font-display text-ink-800 mb-2">
                1-Month Free Trial Activated! 🎉
              </h3>
              <p className="text-ink-600 text-base max-w-md mx-auto mb-4">
                Welcome to <strong>{successPlan}</strong>. Your 30-day free trial has been activated with zero charge today.
              </p>
              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 max-w-sm mx-auto mb-6 text-xs text-amber-900 text-left">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Subscriptions powered by RevenueCat SDK</span>
                </div>
                <p className="text-amber-800">
                  All 10 cognitive games, unlimited memory photos, and full caregiver access are now active on your account.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="btn-primary px-8 py-3 text-base shadow-warm mx-auto"
              >
                Start Exploring {successPlan}
              </button>
            </div>
          ) : (
            <>
              {/* RevenueCat Integration Badge */}
              <div className="flex items-center justify-center gap-2 py-1 px-3 bg-amber-50 border border-amber-200/80 rounded-full w-fit mx-auto mb-4">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-amber-900">
                  Subscriptions powered by <strong className="font-bold">RevenueCat Web SDK</strong>
                </span>
              </div>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <button
              type="button"
              onClick={() => setSelectedPlan('monthly')}
              style={{ cursor: 'pointer', padding: '8px 20px', borderRadius: '999px', border: '2px solid', transition: 'all 0.2s',
                borderColor: selectedPlan === 'monthly' ? '#f59e0b' : '#e5e7eb',
                background: selectedPlan === 'monthly' ? '#fef3c7' : 'white',
                fontWeight: selectedPlan === 'monthly' ? 700 : 500,
                color: selectedPlan === 'monthly' ? '#92400e' : '#6b7280',
              }}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setSelectedPlan('annual')}
              style={{ cursor: 'pointer', padding: '8px 20px', borderRadius: '999px', border: '2px solid', transition: 'all 0.2s',
                borderColor: selectedPlan === 'annual' ? '#f59e0b' : '#e5e7eb',
                background: selectedPlan === 'annual' ? '#fef3c7' : 'white',
                fontWeight: selectedPlan === 'annual' ? 700 : 500,
                color: selectedPlan === 'annual' ? '#92400e' : '#6b7280',
              }}
            >
              Annual <span style={{ marginLeft: '4px', fontSize: '11px', background: '#10b981', color: 'white', borderRadius: '999px', padding: '2px 8px' }}>Save 33%</span>
            </button>
          </div>

          {/* Plans */}
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader className="w-8 h-8 text-honey-500 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              {plans.map((plan) => {
                const rcPackages = offerings?.current?.availablePackages ?? [];
                const matchedPkg = rcPackages.find(
                  (p) => p.identifier.toLowerCase().includes(plan.id) ||
                    p.identifier.toLowerCase().includes(selectedPlan)
                );

                return (
                  <div
                    key={plan.id}
                    className={`relative rounded-2xl border-2 p-5 transition-all ${plan.popular ? plan.borderColor + ' ' + plan.bgColor : 'border-gray-200 bg-gray-50'}`}
                  >
                    {plan.popular && (
                      <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: 'white', fontSize: '11px', fontWeight: 700, borderRadius: '999px', padding: '3px 14px', whiteSpace: 'nowrap' }}>
                        ⭐ Most Popular
                      </div>
                    )}

                    <div className={`flex items-center gap-2 mb-3 ${plan.textColor}`}>
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-white`}>
                        {plan.icon}
                      </div>
                      <span className="font-bold text-base">{plan.name}</span>
                    </div>

                    <div className="mb-3">
                      <div className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-1.5">
                        <span>🎁 1 Month Free Trial</span>
                      </div>
                      <div>
                        <span className="text-2xl font-display font-bold text-ink-800">
                          {selectedPlan === 'annual' ? plan.annualMonthly : plan.monthlyPrice}
                        </span>
                        <span className="text-ink-500 text-sm">/mo</span>
                      </div>
                      <p className="text-xs text-ink-500 mt-0.5">
                        Free for 30 days, then {selectedPlan === 'annual' ? `${plan.annualPrice}/year (${plan.savings})` : `${plan.monthlyPrice}/month`}
                      </p>
                    </div>

                    <ul className="space-y-1.5 mb-4">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-xs text-ink-600">
                          <CheckCircle className="w-3.5 h-3.5 text-sage-500 shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {currentTier === plan.id ? (
                      <div className="w-full py-2.5 px-4 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-sm text-center flex items-center justify-center gap-1.5">
                        <CheckCircle className="w-4 h-4" />
                        <span>Active Plan (Trial Ongoing)</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={!!purchasing}
                        onClick={() => handleSelectPlan(plan.id as 'haven_plus' | 'haven_family', plan.name, matchedPkg)}
                        style={{
                          width: '100%', cursor: purchasing ? 'not-allowed' : 'pointer',
                          padding: '10px', borderRadius: '999px', border: 'none',
                          background: plan.popular ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'linear-gradient(135deg,#6db8a0,#4a9e87)',
                          color: 'white', fontWeight: 700, fontSize: '14px',
                          opacity: purchasing ? 0.7 : 1, transition: 'all 0.2s',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        }}
                      >
                        {purchasing === (matchedPkg?.identifier ?? plan.id) ? (
                          <><Loader className="w-4 h-4 animate-spin" /> Activating Trial…</>
                        ) : (
                          <><Zap className="w-4 h-4" /> Start 1-Month Free Trial</>
                        )}
                      </button>
                    )}
                    <p className="text-[10px] text-center text-ink-400 mt-1.5 font-medium">
                      Cancel anytime before trial ends · No charge today
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Free plan features */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-4">
            <p className="text-xs font-bold text-ink-600 mb-2">✅ Always free in Haven:</p>
            <div className="grid grid-cols-2 gap-1">
              {PLAN_FEATURES.free.map((f) => (
                <p key={f} className="text-xs text-ink-500">• {f}</p>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Restore + footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ink-400 pt-2 border-t border-cream-200">
            <button
              type="button"
              onClick={handleRestore}
              disabled={restoring}
              style={{ cursor: 'pointer', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '4px', color: '#9ca3af' }}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${restoring ? 'animate-spin' : ''}`} />
              Restore Purchases
            </button>
            <div className="flex items-center gap-2 text-[11px] text-ink-400">
              <span className="font-medium text-amber-700">Verified by RevenueCat</span>
              <span>•</span>
              <a href="#" className="hover:underline">Terms</a>
              <span>•</span>
              <a href="#" className="hover:underline">Privacy</a>
            </div>
          </div>
        </>
      )}
    </div>
      </div>
    </div>
  );
}
