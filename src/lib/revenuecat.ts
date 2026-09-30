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
 * Determine subscription tier from CustomerInfo.
 */
export function getSubscriptionTier(info: CustomerInfo | null): SubscriptionTier {
  if (!info) return 'free';
  const entitlements = info.entitlements.active;
  if (entitlements['haven_family'] || entitlements['family']) return 'haven_family';
  if (entitlements['haven_plus'] || entitlements['premium'] || entitlements['pro']) return 'haven_plus';
  return 'free';
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
