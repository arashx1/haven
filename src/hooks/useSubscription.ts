import { useState, useEffect, useCallback } from 'react';
import { getCustomerInfo, getSubscriptionTier, type SubscriptionTier } from '@/lib/revenuecat';

interface UseSubscriptionReturn {
  tier: SubscriptionTier;
  isPro: boolean;
  isFamily: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
}

export function useSubscription(): UseSubscriptionReturn {
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const info = await getCustomerInfo();
      setTier(getSubscriptionTier(info));
    } catch {
      setTier('free');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener('haven_subscription_changed', handler);
    return () => window.removeEventListener('haven_subscription_changed', handler);
  }, [refresh]);

  return {
    tier,
    isPro: tier === 'haven_plus' || tier === 'haven_family',
    isFamily: tier === 'haven_family',
    loading,
    refresh,
  };
}
