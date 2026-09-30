import { Purchases, type CustomerInfo, type Offerings } from '@revenuecat/purchases-js';

// RevenueCat Web API key - set in env or fallback to placeholder
const RC_API_KEY = import.meta.env.VITE_REVENUECAT_API_KEY || '';

export type SubscriptionTier = 'free' | 'haven_plus' | 'haven_family';

export interface SubscriptionStatus {
  tier: SubscriptionTier;
  isActive: boolean;
  expiresAt?: Date;
  managementUrl?: string;
}

let purchasesInstance: Purchases | null = null;

/**
 * Initialize RevenueCat SDK with the current user ID.
 * Call this after user logs in.
 */
export async function initRevenueCat(userId: string): Promise<void> {
  if (!RC_API_KEY) {
    console.info('[RevenueCat] No API key set — running in free/demo mode.');
    return;
  }
  try {
    purchasesInstance = Purchases.configure(RC_API_KEY, userId);
    console.info('[RevenueCat] Initialized for user:', userId);
  } catch (err) {
    console.warn('[RevenueCat] Failed to initialize:', err);
  }
}

/**
 * Get available subscription offerings.
 */
export async function getOfferings(): Promise<Offerings | null> {
  if (!purchasesInstance) return null;
  try {
    return await purchasesInstance.getOfferings();
  } catch (err) {
    console.warn('[RevenueCat] Failed to fetch offerings:', err);
    return null;
  }
}

/**
 * Get customer subscription info.
 */
export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  if (!purchasesInstance) return null;
  try {
    return await purchasesInstance.getCustomerInfo();
  } catch (err) {
    console.warn('[RevenueCat] Failed to fetch customer info:', err);
    return null;
  }
}

/**
 * Determine subscription tier from CustomerInfo or local demo state.
 */
export function getSubscriptionTier(info: CustomerInfo | null): SubscriptionTier {
  if (info) {
    const entitlements = info.entitlements.active;
    if (entitlements['haven_family'] || entitlements['family']) return 'haven_family';
    if (entitlements['haven_plus'] || entitlements['premium'] || entitlements['pro']) return 'haven_plus';
  }
  // Check local demo trial storage with automatic 30-day expiration
  const localTier = localStorage.getItem('haven_subscription_tier') as SubscriptionTier | null;
  const expiry = localStorage.getItem('haven_subscription_expiry');
  if (expiry && new Date(expiry).getTime() < Date.now()) {
    // 1-Month Free Trial has ended, automatically revert to free
    localStorage.removeItem('haven_subscription_tier');
    localStorage.removeItem('haven_subscription_expiry');
    return 'free';
  }
  if (localTier === 'haven_plus' || localTier === 'haven_family') {
    return localTier;
  }
  return 'free';
}

/**
 * Activate a 1-month free trial in demo/simulation mode.
 */
export function activateDemoSubscription(tier: SubscriptionTier = 'haven_plus') {
  localStorage.setItem('haven_subscription_tier', tier);
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 30);
  localStorage.setItem('haven_subscription_expiry', expiry.toISOString());
  window.dispatchEvent(new Event('haven_subscription_changed'));
}

/**
 * Cancel local demo subscription.
 */
export function cancelDemoSubscription() {
  localStorage.removeItem('haven_subscription_tier');
  localStorage.removeItem('haven_subscription_expiry');
  window.dispatchEvent(new Event('haven_subscription_changed'));
}

/**
 * Purchase a package.
 */
export async function purchasePackage(
  rcPackage: Parameters<Purchases['purchase']>[0]['rcPackage']
): Promise<{ success: boolean; customerInfo?: CustomerInfo; error?: string }> {
  if (!purchasesInstance) {
    return { success: false, error: 'RevenueCat not initialized' };
  }
  try {
    const { customerInfo } = await purchasesInstance.purchase({ rcPackage });
    return { success: true, customerInfo };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Purchase failed';
    if (msg.toLowerCase().includes('cancel')) {
      return { success: false, error: 'cancelled' };
    }
    return { success: false, error: msg };
  }
}

/**
 * Restore purchases (useful if user reinstalls or switches browsers).
 */
export async function restorePurchases(): Promise<CustomerInfo | null> {
  if (!purchasesInstance) return null;
  try {
    return await purchasesInstance.restorePurchases();
  } catch (err) {
    console.warn('[RevenueCat] Restore failed:', err);
    return null;
  }
}

export { purchasesInstance };
