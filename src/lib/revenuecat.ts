import type { CustomerInfo, Package } from '@revenuecat/purchases-js';
import { supabase } from './supabaseClient';
export type SubscriptionTier = 'free' | 'haven_plus' | 'haven_family';
const key = import.meta.env.VITE_REVENUECAT_API_KEY || '';
export const billingConfigured = Boolean(key && !key.startsWith('test_'));
let initialization: Promise<import('@revenuecat/purchases-js').Purchases> | null = null;
let boundUser: string | null = null;
async function client() {
  if (!billingConfigured) throw new Error('Subscriptions are not available yet. Your care tools remain available.');
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error('Please sign in to manage your subscription.');
  const userId = data.user.id;
  if (initialization) await initialization.catch(() => undefined);
  if (boundUser !== userId || !initialization) {
    boundUser = userId;
    initialization = (async () => {
      const { Purchases } = await import('@revenuecat/purchases-js');
      if (Purchases.isConfigured()) {
        const instance = Purchases.getSharedInstance();
        await instance.changeUser(userId);
        return instance;
      }
      return Purchases.configure(key, userId);
    })();
  }
  try { return await initialization; }
  catch (error) { initialization = null; boundUser = null; throw error; }
}
export async function getOfferings() { return (await client()).getOfferings(); }
export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  if (!billingConfigured) return null;
  return (await client()).getCustomerInfo();
}
export function getSubscriptionTier(info: CustomerInfo | null): SubscriptionTier {
  if (info?.entitlements.active.haven_family) return 'haven_family';
  if (info?.entitlements.active.haven_plus) return 'haven_plus';
  return 'free';
}
export async function purchasePackage(rcPackage: Package) {
  const result = await (await client()).purchase({ rcPackage });
  window.dispatchEvent(new Event('haven_subscription_changed'));
  return result.customerInfo;
}
