import { useEffect, useState } from 'react';
import type { Package, CustomerInfo } from '@revenuecat/purchases-js';
import { X, ShieldCheck, RefreshCw } from 'lucide-react';
import { billingConfigured, getOfferings, getCustomerInfo, purchasePackage, getSubscriptionTier } from '@/lib/revenuecat';
import { errorMessage } from '@/lib/supabaseClient';
import { useDialog } from '@/hooks/useDialog';
export function PaywallModal({ onClose }: { onClose: () => void; onSuccess?: () => void }) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [info, setInfo] = useState<CustomerInfo | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const ref = useDialog(() => { if (!busy) onClose(); });
  useEffect(() => {
    let active = true;
    if (!billingConfigured) { setLoading(false); return; }
    Promise.all([getOfferings(), getCustomerInfo()]).then(([offers, customer]) => {
      if (active) { setPackages(offers.current?.availablePackages || []); setInfo(customer); }
    }).catch(e => { if (active) setError(errorMessage(e)); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const purchase = async (pkg: Package) => {
    setBusy(true); setError(''); setNotice('');
    try {
      const customer = await purchasePackage(pkg);
      setInfo(customer);
      setNotice(getSubscriptionTier(customer) !== 'free' ? 'Your membership is active. Thank you for supporting Haven.' : 'Checkout returned. Refresh your membership status to check activation.');
    } catch (e) { setError(errorMessage(e)); }
    finally { setBusy(false); }
  };
  const refresh = async () => {
    setBusy(true); setError('');
    try { setInfo(await getCustomerInfo()); setNotice('Membership status updated for your signed-in account.'); window.dispatchEvent(new Event('haven_subscription_changed')); }
    catch (e) { setError(errorMessage(e)); }
    finally { setBusy(false); }
  };
  return <div className="modal-backdrop"><div ref={ref} role="dialog" aria-modal="true" aria-labelledby="billing-title" tabIndex={-1} className="modal-card">
    <div className="flex items-center justify-between gap-4"><h2 id="billing-title" className="section-title text-2xl">Haven membership</h2><button disabled={busy} onClick={onClose} aria-label="Close membership details" className="icon-button"><X /></button></div>
    <p className="text-ink-600 my-4">Daily care, family contacts, memories, activities, and shared care remain available without a subscription. Membership supports Haven.</p>
    <p className="font-bold mb-4">Current membership: {getSubscriptionTier(info).replace('haven_', 'Haven ')}</p>
    {loading && <p role="status">Loading available plans…</p>}
    {!loading && !packages.length && <p className="notice">{billingConfigured ? 'No plans are currently available. Please try again later.' : 'Membership checkout is not available yet. You can continue using your care tools.'}</p>}
    {error && <p role="alert" className="error-message">{error}</p>}
    {notice && <p role="status" className="notice">{notice}</p>}
    <div className="space-y-3 my-5">{packages.map(pkg => <div key={pkg.identifier} className="card-base p-5">
      <h3 className="text-xl font-bold">{pkg.webBillingProduct.title}</h3><p>{pkg.webBillingProduct.description}</p>
      <p className="text-xl font-bold my-3">{pkg.webBillingProduct.currentPrice.formattedPrice}</p>
      <p className="text-sm text-ink-600 mb-3">Billing period, renewal terms, and any eligible trial are shown in secure checkout before you confirm.</p>
      <button className="btn-primary w-full" disabled={busy} onClick={() => purchase(pkg)}>{busy ? 'Please wait…' : 'Review plan in secure checkout'}</button>
    </div>)}</div>
    {billingConfigured && <button onClick={refresh} disabled={busy} className="btn-secondary w-full"><RefreshCw className="w-5 h-5" />Refresh membership</button>}
    {info?.managementURL && /^https:\/\//.test(info.managementURL) && <a href={info.managementURL} target="_blank" rel="noopener noreferrer" className="btn-secondary w-full mt-3">Manage or cancel membership</a>}
    <p className="text-sm text-ink-500 mt-5 flex gap-2"><ShieldCheck className="w-5 h-5 shrink-0" />Payment details are entered only in the payment provider's checkout.</p>
  </div></div>;
}
