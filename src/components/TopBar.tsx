import { useApp } from '@/context/AppContext';
import { LANGUAGES, type Language } from '@/data/mockData';
import { Globe, Type, ChevronDown, Check, Sparkles } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function TopBar() {
  const { language, setLanguage, textScale, setTextScale, navigate, authState } = useApp();
  const { t } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 bg-cream-50/90 backdrop-blur-md border-b border-cream-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <button
          onClick={() => navigate(authState === 'authenticated' ? 'my-day' : 'login')}
          className="flex items-center gap-3 text-left group focus:outline-none"
          title="Haven - Your Caring Companion"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-honey-400 to-honey-600 flex items-center justify-center shadow-warm shrink-0 group-hover:scale-105 transition-transform">
            <span className="text-white font-display font-extrabold text-2xl">H</span>
          </div>
          <div className="hidden sm:block">
            <p className="font-display font-extrabold text-ink-800 text-xl leading-tight tracking-tight group-hover:text-honey-700 transition">
              Haven
            </p>
            <p className="text-ink-400 text-xs sm:text-sm leading-tight">Your caring companion</p>
          </div>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Feature Tour Button */}
          <button
            onClick={() => navigate('demo')}
            className="flex items-center gap-1.5 bg-honey-100 hover:bg-honey-200 border border-honey-300 text-honey-800 rounded-2xl px-3 py-2 transition font-bold text-sm"
            title="Explore Interactive Product Tour"
          >
            <Sparkles className="w-4 h-4 text-honey-600" />
            <span className="hidden md:inline">{t('tour', 'Tour')}</span>
          </button>

          {/* Text size control */}
          <div className="flex items-center gap-1 bg-cream-100 rounded-2xl p-1.5 border border-cream-300 shadow-xs" title={t('textSize', 'Text Size')}>
            <Type className="w-4 h-4 text-ink-400 ml-1.5" />
            <button
              onClick={() => setTextScale((Math.max(1, textScale - 1)) as 1 | 2 | 3 | 4)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-ink-600 hover:bg-cream-200 transition flex items-center justify-center font-bold text-base sm:text-lg active:scale-95"
              aria-label="Make text smaller"
              title="A- Smaller text"
            >
              A−
            </button>
            <button
              onClick={() => setTextScale((Math.min(4, textScale + 1)) as 1 | 2 | 3 | 4)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-ink-600 hover:bg-cream-200 transition flex items-center justify-center font-bold text-lg sm:text-xl active:scale-95"
              aria-label="Make text larger"
              title="A+ Larger text"
            >
              A+
            </button>
          </div>

          {/* Language selector */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen((o) => !o)}
              className="flex items-center gap-2 bg-cream-100 rounded-2xl px-3 sm:px-4 py-2 border border-cream-300 hover:bg-cream-200 transition font-semibold text-ink-700 shadow-xs active:scale-95"
              aria-label="Select language"
            >
              <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-honey-600" />
              <span className="text-sm sm:text-base font-bold">{current?.nativeLabel}</span>
              <ChevronDown className={`w-4 h-4 text-ink-400 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-2 bg-white rounded-2xl shadow-lift border border-cream-200 py-2 w-56 max-h-80 overflow-y-auto animate-scaleIn origin-top-right z-50">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as Language);
                      setLangOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-cream-100 transition text-left ${
                      language === lang.code ? 'bg-honey-50/70' : ''
                    }`}
                  >
                    <div>
                      <p className="font-bold text-ink-800 text-sm sm:text-base">{lang.nativeLabel}</p>
                      <p className="text-xs text-ink-400">{lang.label}</p>
                    </div>
                    {language === lang.code && <Check className="w-5 h-5 text-honey-600 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
