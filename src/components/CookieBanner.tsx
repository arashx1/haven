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

  if (accepted) return null;

  return (
    <aside
      aria-label="Cookie and Privacy Preferences"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-scaleIn"
    >
      <div className="bg-white/95 backdrop-blur-md border-2 border-honey-300 rounded-3xl p-5 shadow-lift text-ink-800">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-honey-100 flex items-center justify-center shrink-0">
            <Cookie className="w-5 h-5 text-honey-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-bold text-base leading-tight">Privacy & Local Storage</h2>
              <button
                onClick={handleAccept}
                className="text-ink-400 hover:text-ink-700 transition p-1"
                aria-label="Close banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-ink-500 mt-1.5 leading-relaxed">
              Haven uses essential cookies and on-device storage to securely preserve your loved one’s care routine, family photos, and language preferences.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleAccept}
                className="btn-primary text-xs py-2 px-4 shadow-xs"
              >
                Accept & Continue
              </button>
              <div className="flex items-center gap-1 text-[11px] text-sage-700 font-semibold ml-auto">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>HIPAA & GDPR Safe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
