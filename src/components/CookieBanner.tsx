import { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, X } from 'lucide-react';

export function CookieBanner() {
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem('haven_cookie_consent');
    if (!consent) {
      setAccepted(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('haven_cookie_consent', 'accepted');
    setAccepted(true);
  };

  const handleDecline = () => {
    localStorage.setItem('haven_cookie_consent', 'declined');
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <aside
      aria-label="Cookie and Privacy Preferences"
      style={{ position: 'fixed', bottom: '1rem', right: '1.5rem', maxWidth: '28rem', zIndex: 9999 }}
      className="animate-scaleIn"
    >
      <div className="bg-white/95 backdrop-blur-md border-2 border-honey-300 rounded-3xl p-5 shadow-lift text-ink-800">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-honey-100 flex items-center justify-center shrink-0">
            <Cookie className="w-5 h-5 text-honey-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-bold text-base leading-tight">Privacy &amp; Local Storage</h2>
              <button
                type="button"
                onClick={handleDecline}
                style={{ cursor: 'pointer', padding: '4px' }}
                className="text-ink-400 hover:text-ink-700 transition"
                aria-label="Close banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-ink-500 mt-1.5 leading-relaxed">
              Haven uses essential cookies and on-device storage to securely preserve your loved one&apos;s care routine, family photos, and language preferences.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <button
                type="button"
                onClick={handleAccept}
                style={{
                  cursor: 'pointer',
                  padding: '8px 16px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '13px',
                  border: 'none',
                  outline: 'none',
                  boxShadow: '0 2px 8px rgba(245,158,11,0.4)',
                }}
              >
                Accept &amp; Continue
              </button>
              <button
                type="button"
                onClick={handleDecline}
                style={{
                  cursor: 'pointer',
                  padding: '8px 12px',
                  borderRadius: '999px',
                  background: 'transparent',
                  color: '#6b7280',
                  fontWeight: 600,
                  fontSize: '12px',
                  border: '1.5px solid #e5e7eb',
                }}
              >
                Decline
              </button>
              <div className="flex items-center gap-1 text-[11px] text-sage-700 font-semibold ml-auto">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>HIPAA &amp; GDPR Safe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
