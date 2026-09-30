import { useApp } from '@/context/AppContext';
import { HeartHandshake, X } from 'lucide-react';
import { useState } from 'react';

export function FamilyHelpAccess() {
  const { navigate } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-30 w-12 h-12 rounded-full bg-cream-200 border-2 border-cream-300 flex items-center justify-center text-ink-500 hover:text-ink-700 hover:bg-cream-300 transition shadow-soft"
        aria-label="Ask a family member for help"
        title="Family Helper"
      >
        <HeartHandshake className="w-6 h-6" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40 animate-fadeIn" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-3xl shadow-lift p-6 max-w-sm w-full animate-scaleIn text-center" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3 text-left">
              <p className="font-display font-extrabold text-ink-800 text-xl">Family Helper</p>
              <button onClick={() => setOpen(false)} className="w-9 h-9 rounded-full bg-cream-100 hover:bg-cream-200 flex items-center justify-center text-ink-400" aria-label="Close dialog">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-ink-600 text-base mb-5 text-left">
              Need someone to set up your reminders or add family photos?
            </p>
            <button
              onClick={() => { setOpen(false); navigate('caregiver-dashboard'); }}
              className="btn-primary w-full text-lg mb-3"
            >
              <HeartHandshake className="w-5 h-5" />
              Open Helper Screen
            </button>
            <button
              onClick={() => setOpen(false)}
              className="btn-secondary w-full text-base"
            >
              I'm Good, Thanks
            </button>
          </div>
        </div>
      )}
    </>
  );
}
