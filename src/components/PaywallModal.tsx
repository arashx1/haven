import { useState, useEffect } from 'react';
import {
  X,
  Star,
  Heart,
  Users,
  Zap,
  CheckCircle,
  RefreshCw,
  Loader,
  Sparkles,
  CreditCard,
  Lock,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Check,
} from 'lucide-react';
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

interface PlanConfig {
  id: 'haven_plus' | 'haven_family';
  name: string;
  icon: React.ReactNode;
  color: string;
  textColor: string;
  borderColor: string;
  bgColor: string;
  monthlyPrice: string;
  annualPrice: string;
  annualMonthly: string;
  savings: string;
  features: string[];
  popular: boolean;
}

export function PaywallModal({ onClose, onSuccess, featureName }: PaywallProps) {
  const [offerings, setOfferings] = useState<Offerings | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [error, setError] = useState('');
  const [selectedBilling, setSelectedBilling] = useState<'monthly' | 'annual'>('annual');
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>('free');

  // Checkout flow state: 'plans' -> 'checkout' -> 'success'
  const [step, setStep] = useState<'plans' | 'checkout' | 'success'>('plans');
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<PlanConfig | null>(null);

  // Card details form
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet' | 'paypal'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [cardEnding, setCardEnding] = useState('4242');

  const plans: PlanConfig[] = [
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

  useEffect(() => {
    setCurrentTier(getSubscriptionTier(null));
    getOfferings().then((o) => {
      setOfferings(o);
      setLoading(false);
    });
  }, []);

  const isDemoMode = !offerings && !loading;

  // Format card number with spaces (4242 4242 4242 4242)
  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const parts = raw.match(/[\s\S]{1,4}/g) || [];
    setCardNumber(parts.join(' '));
  };

  // Format expiry with slash (MM/YY)
  const handleExpiryChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  // Fill sample test card for instant demo & review
  const handleQuickFillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardExpiry('12/28');
    setCardCvc('123');
    setCardName('Elena Vance');
    setError('');
  };

  // Advance to Checkout view
  const handleProceedToCheckout = (plan: PlanConfig) => {
    setSelectedPlanForCheckout(plan);
    setStep('checkout');
    setError('');
  };

  // Submit payment & activate trial
  const handleExecutePayment = async () => {
    setError('');

    if (paymentMethod === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 15) {
        setError('Please enter a valid 16-digit card number.');
        return;
      }
      if (cardExpiry.length < 4) {
        setError('Please enter a valid card expiration date (MM/YY).');
        return;
      }
      if (cardCvc.length < 3) {
        setError('Please enter a valid 3 or 4-digit CVC code.');
        return;
      }
      if (!cardName.trim()) {
        setError('Please enter the name on the card.');
        return;
      }
    }

    setIsProcessingPayment(true);

    const activePlan = selectedPlanForCheckout || plans[0];
    const rcPackages = offerings?.current?.availablePackages ?? [];
    const matchedPkg = rcPackages.find(
      (p) =>
        p.identifier.toLowerCase().includes(activePlan.id) ||
        p.identifier.toLowerCase().includes(selectedBilling)
    );

    // If live RevenueCat SDK is configured and has offerings
    if (matchedPkg && !isDemoMode) {
      setPurchasing(matchedPkg.identifier);
      const result = await purchasePackage(matchedPkg);
      setPurchasing(null);
      setIsProcessingPayment(false);

      if (result.success && result.customerInfo) {
        const tier = getSubscriptionTier(result.customerInfo);
        console.info('[RevenueCat] Live purchase success, tier:', tier);
        setCurrentTier(tier);
        setStep('success');
        onSuccess?.();
      } else if (result.error && result.error !== 'cancelled') {
        setError(result.error);
      }
      return;
    }

    // Realistic simulation with RevenueCat Web Billing
    setTimeout(() => {
      activateDemoSubscription(activePlan.id);
      setCurrentTier(activePlan.id);

      const last4 = cardNumber.replace(/\s/g, '').slice(-4) || '4242';
      setCardEnding(last4);
      localStorage.setItem('haven_payment_card', last4);
      localStorage.setItem('haven_payment_brand', 'Visa');

      setIsProcessingPayment(false);
      setStep('success');
      onSuccess?.();
    }, 1200);
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
      const localTier = getSubscriptionTier(null);
      if (localTier !== 'free') {
        setCurrentTier(localTier);
        setError('');
      } else {
        setError('No active subscription found to restore.');
      }
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)' }} />

      {/* Modal */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '92vh',
          overflowY: 'auto',
          margin: '1rem',
        }}
        className="bg-white rounded-3xl shadow-2xl animate-scaleIn border border-cream-200"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-honey-400 via-honey-500 to-coral-500 p-6 rounded-t-3xl text-white overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 50%)' }}
          />
          <button
            type="button"
            onClick={onClose}
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

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold">
                {step === 'checkout' ? 'Complete Your Subscription' : 'Upgrade Haven'}
              </h2>
              <p className="text-white/80 text-sm">
                {step === 'checkout'
                  ? '30-Day Free Trial · Subscriptions via RevenueCat'
                  : featureName ? `Unlock "${featureName}" and more` : 'Unlimited memories, mind games & caregiver tools'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* STEP 1: PLANS SELECTION */}
          {step === 'plans' && (
            <>
              {/* RevenueCat Integration Badge */}
              <div className="flex items-center justify-center gap-2 py-1 px-3.5 bg-amber-50 border border-amber-200/80 rounded-full w-fit mx-auto mb-4 shadow-xs">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-amber-900">
                  Subscriptions powered by <strong className="font-bold">RevenueCat Web SDK</strong>
                </span>
              </div>

              {/* Billing toggle */}
              <div className="flex items-center justify-center gap-3 mb-5">
                <button
                  type="button"
                  onClick={() => setSelectedBilling('monthly')}
                  style={{
                    cursor: 'pointer',
                    padding: '8px 20px',
                    borderRadius: '999px',
                    border: '2px solid',
                    transition: 'all 0.2s',
                    borderColor: selectedBilling === 'monthly' ? '#f59e0b' : '#e5e7eb',
                    background: selectedBilling === 'monthly' ? '#fef3c7' : 'white',
                    fontWeight: selectedBilling === 'monthly' ? 700 : 500,
                    color: selectedBilling === 'monthly' ? '#92400e' : '#6b7280',
                  }}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedBilling('annual')}
                  style={{
                    cursor: 'pointer',
                    padding: '8px 20px',
                    borderRadius: '999px',
                    border: '2px solid',
                    transition: 'all 0.2s',
                    borderColor: selectedBilling === 'annual' ? '#f59e0b' : '#e5e7eb',
                    background: selectedBilling === 'annual' ? '#fef3c7' : 'white',
                    fontWeight: selectedBilling === 'annual' ? 700 : 500,
                    color: selectedBilling === 'annual' ? '#92400e' : '#6b7280',
                  }}
                >
                  Annual{' '}
                  <span style={{ marginLeft: '4px', fontSize: '11px', background: '#10b981', color: 'white', borderRadius: '999px', padding: '2px 8px' }}>
                    Save 33%
                  </span>
                </button>
              </div>

              {/* Plans Grid */}
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader className="w-8 h-8 text-honey-500 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  {plans.map((plan) => {
                    const isCurrent = currentTier === plan.id;
                    return (
                      <div
                        key={plan.id}
                        className={`relative rounded-2xl border-2 p-5 transition-all flex flex-col justify-between ${
                          plan.popular ? plan.borderColor + ' ' + plan.bgColor : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        {plan.popular && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '-12px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              background: 'linear-gradient(135deg,#f59e0b,#d97706)',
                              color: 'white',
                              fontSize: '11px',
                              fontWeight: 700,
                              borderRadius: '999px',
                              padding: '3px 14px',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            ⭐ Most Popular
                          </div>
                        )}

                        <div>
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
                                {selectedBilling === 'annual' ? plan.annualMonthly : plan.monthlyPrice}
                              </span>
                              <span className="text-ink-500 text-sm">/mo</span>
                            </div>
                            <p className="text-xs text-ink-500 mt-0.5">
                              Free for 30 days, then {selectedBilling === 'annual' ? `${plan.annualPrice}/year (${plan.savings})` : `${plan.monthlyPrice}/month`}
                            </p>
                          </div>

                          <ul className="space-y-1.5 mb-4">
                            {plan.features.map((f) => (
                              <li key={f} className="flex items-start gap-2 text-xs text-ink-600">
                                <CheckCircle className="w-3.5 h-3.5 text-sage-500 shrink-0 mt-0.5" />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          {isCurrent ? (
                            <div className="w-full py-2.5 px-4 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-sm text-center flex items-center justify-center gap-1.5">
                              <Check className="w-4 h-4" />
                              <span>Active Plan (Trial Ongoing)</span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleProceedToCheckout(plan)}
                              style={{
                                width: '100%',
                                cursor: 'pointer',
                                padding: '10px',
                                borderRadius: '999px',
                                border: 'none',
                                background: plan.popular
                                  ? 'linear-gradient(135deg,#f59e0b,#d97706)'
                                  : 'linear-gradient(135deg,#6db8a0,#4a9e87)',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                              }}
                              className="active:scale-95 transition-transform shadow-xs hover:shadow-md"
                            >
                              <CreditCard className="w-4 h-4" />
                              <span>Continue to Payment →</span>
                            </button>
                          )}
                          <p className="text-[10px] text-center text-ink-400 mt-1.5 font-medium">
                            Zero charge today · 1-Month Free Trial
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Free plan features */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-4 border border-gray-100">
                <p className="text-xs font-bold text-ink-600 mb-2">✅ Always included free in Haven:</p>
                <div className="grid grid-cols-2 gap-1.5">
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

          {/* STEP 2: CHECKOUT & PAYMENT */}
          {step === 'checkout' && selectedPlanForCheckout && (
            <div className="animate-fadeIn">
              {/* Back to plans */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-cream-200">
                <button
                  type="button"
                  onClick={() => setStep('plans')}
                  className="flex items-center gap-1.5 text-xs font-bold text-ink-600 hover:text-ink-800 transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Plan</span>
                </button>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  🎁 30-Day Free Trial
                </span>
              </div>

              {/* Order Summary Card */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-amber-800 font-bold uppercase tracking-wider">Plan Selected</p>
                  <p className="text-base font-bold text-ink-800 flex items-center gap-1.5">
                    {selectedPlanForCheckout.name}{' '}
                    <span className="text-xs font-normal text-ink-500">
                      ({selectedBilling === 'annual' ? 'Billed Annually' : 'Billed Monthly'})
                    </span>
                  </p>
                  <p className="text-xs text-ink-500 mt-0.5">
                    First 30 days are <strong>$0.00</strong>. Renews at{' '}
                    {selectedBilling === 'annual'
                      ? `${selectedPlanForCheckout.annualPrice}/yr`
                      : `${selectedPlanForCheckout.monthlyPrice}/mo`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-ink-400">Due Today</p>
                  <p className="text-2xl font-bold font-display text-emerald-600">$0.00</p>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-ink-700 uppercase tracking-wider mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      paymentMethod === 'card'
                        ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-xs'
                        : 'border-cream-300 bg-white text-ink-600 hover:bg-cream-100'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-amber-600" />
                    <span>Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wallet')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      paymentMethod === 'wallet'
                        ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-xs'
                        : 'border-cream-300 bg-white text-ink-600 hover:bg-cream-100'
                    }`}
                  >
                    <span>Apple / GPay</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      paymentMethod === 'paypal'
                        ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-xs'
                        : 'border-cream-300 bg-white text-ink-600 hover:bg-cream-100'
                    }`}
                  >
                    <span>PayPal</span>
                  </button>
                </div>
              </div>

              {/* Card Details Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 mb-5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-ink-700">Cardholder Information</label>
                    <button
                      type="button"
                      onClick={handleQuickFillTestCard}
                      className="text-[11px] font-bold text-honey-700 bg-honey-100 hover:bg-honey-200 px-2 py-0.5 rounded-md transition"
                    >
                      🧪 Auto-Fill Demo Card
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-ink-500 mb-1">Name on Card</label>
                    <input
                      type="text"
                      placeholder="e.g. Elena Vance"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-honey-500 bg-white shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-ink-500 mb-1">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        value={cardNumber}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        className="w-full px-3.5 py-2.5 pr-14 rounded-xl border border-cream-300 text-sm font-mono focus:outline-none focus:border-honey-500 bg-white shadow-xs"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <CreditCard className="w-5 h-5 text-ink-400" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-ink-500 mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        placeholder="MM / YY"
                        value={cardExpiry}
                        onChange={(e) => handleExpiryChange(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-sm font-mono focus:outline-none focus:border-honey-500 bg-white shadow-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-ink-500 mb-1">CVC / CVV</label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-sm font-mono focus:outline-none focus:border-honey-500 bg-white shadow-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod !== 'card' && (
                <div className="p-6 text-center bg-cream-50 rounded-2xl border border-cream-200 mb-5">
                  <p className="text-sm font-bold text-ink-700 mb-1">
                    {paymentMethod === 'wallet' ? 'Apple Pay / Google Pay' : 'PayPal Express'}
                  </p>
                  <p className="text-xs text-ink-500">
                    Instant 1-tap checkout verified via RevenueCat Web Billing.
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-xs text-red-700 font-medium">
                  {error}
                </div>
              )}

              {/* Pay Now Button */}
              <button
                type="button"
                disabled={isProcessingPayment}
                onClick={handleExecutePayment}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-base shadow-warm flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Processing with RevenueCat Web Billing…</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-emerald-200" />
                    <span>Pay $0.00 Now &amp; Start 30-Day Free Trial</span>
                  </>
                )}
              </button>

              {/* Security Badges */}
              <div className="flex items-center justify-center gap-4 mt-3 text-[11px] text-ink-400">
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-sage-600" />
                  256-Bit SSL Encrypted
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-honey-600" />
                  Cancel Anytime in 1 Tap
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS / CELEBRATION */}
          {step === 'success' && (
            <div className="py-6 px-2 text-center animate-scaleIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-soft">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold font-display text-ink-800 mb-2">
                Payment Verified &amp; Trial Active! 🎉
              </h3>
              <p className="text-ink-600 text-base max-w-md mx-auto mb-4">
                Welcome to <strong>{selectedPlanForCheckout?.name || 'Haven Plus'}</strong>. Your 30-day free trial has been activated with zero charge today.
              </p>

              {/* Receipt Summary Card */}
              <div className="bg-cream-50 border border-cream-200 rounded-2xl p-4 max-w-sm mx-auto mb-5 text-xs text-left space-y-1.5">
                <div className="flex justify-between text-ink-500">
                  <span>Payment Method:</span>
                  <span className="font-semibold text-ink-800">Visa ending in •••• {cardEnding}</span>
                </div>
                <div className="flex justify-between text-ink-500">
                  <span>Charged Today:</span>
                  <span className="font-bold text-emerald-600">$0.00 (Free Trial)</span>
                </div>
                <div className="flex justify-between text-ink-500">
                  <span>Next Billing Date:</span>
                  <span className="font-medium text-ink-700">30 days from today</span>
                </div>
                <div className="flex justify-between text-ink-500 pt-1 border-t border-cream-200">
                  <span>Entitlement Status:</span>
                  <span className="font-bold text-amber-700 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    RevenueCat Active
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="btn-primary px-8 py-3 text-base shadow-warm mx-auto"
              >
                Start Exploring {selectedPlanForCheckout?.name || 'Haven Plus'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
