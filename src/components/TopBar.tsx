import { useApp } from '@/context/AppContext';
import { LANGUAGES, type Language } from '@/data/mockData';
import { Globe, Type, ChevronDown, Check, Sparkles, Crown, Sun, Moon, Search } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SiteSearchModal } from './SiteSearchModal';

function useDarkMode() {
  const [dark, setDark] = useState<boolean>(() => {
    const stored = localStorage.getItem('haven_dark_mode');
    if (stored !== null) return stored === 'true';
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('haven_dark_mode', String(dark));
  }, [dark]);

  return [dark, setDark] as const;
}

export function TopBar() {
  const { language, setLanguage, textScale, setTextScale, navigate, authState, openPaywall } = useApp();
  const { t } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dark, setDark] = useDarkMode();
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

  // Listen for global Ctrl+K to open search
  useEffect(() => {
    const handler = (e: Event) => {
      if ((e as CustomEvent).type === 'haven_open_search') setSearchOpen(true);
    };
    window.addEventListener('haven_open_search', handler);
    return () => window.removeEventListener('haven_open_search', handler);
  }, []);

  const current = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <>
      {/* Skip to Content – Item 12 */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-honey-500 focus:text-white focus:font-bold focus:rounded-xl focus:shadow-lg focus:outline-none"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 bg-cream-50/90 dark:bg-ink-900/90 backdrop-blur-md border-b border-cream-200 dark:border-ink-800 shadow-xs">
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
          {/* Site Search Button – Item 3 */}
          <button
            id="site-search-btn"
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-1.5 bg-cream-100 dark:bg-ink-800 hover:bg-cream-200 dark:hover:bg-ink-700 border border-cream-300 dark:border-ink-700 text-ink-600 dark:text-ink-300 rounded-2xl px-3 py-2 transition font-bold text-sm"
            title="Search (Ctrl+K)"
            aria-label="Open site search"
          >
            <Search className="w-4 h-4" />
            <span className="hidden md:inline text-xs text-ink-400 dark:text-ink-500 font-normal">Ctrl+K</span>
          </button>

          {/* Feature Tour Button */}
          <button
            onClick={() => navigate('demo')}
            className="flex items-center gap-1.5 bg-honey-100 hover:bg-honey-200 border border-honey-300 text-honey-800 rounded-2xl px-3 py-2 transition font-bold text-sm"
            title="Explore Interactive Product Tour"
          >
            <Sparkles className="w-4 h-4 text-honey-600" />
            <span className="hidden md:inline">{t('tour', 'Tour')}</span>
          </button>

          {/* Dark Mode Toggle – Item 1 */}
          <button
            id="dark-mode-toggle"
            onClick={() => setDark((d) => !d)}
            className="w-9 h-9 flex items-center justify-center rounded-2xl bg-cream-100 dark:bg-ink-800 hover:bg-cream-200 dark:hover:bg-ink-700 border border-cream-300 dark:border-ink-700 text-ink-600 dark:text-ink-300 transition active:scale-95"
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={dark ? 'Light Mode' : 'Dark Mode'}
          >
            {dark ? <Sun className="w-4 h-4 text-honey-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* RevenueCat Subscriptions Button */}
          <button
            onClick={openPaywall}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-warm rounded-2xl px-3.5 py-2 transition font-bold text-sm active:scale-95 group cursor-pointer"
            title="Subscriptions powered by RevenueCat SDK"
          >
            <Crown className="w-4 h-4 text-amber-200 group-hover:scale-110 transition-transform" />
            <span>Upgrade</span>
            <span className="hidden lg:inline text-[10px] font-semibold bg-white/20 text-white px-1.5 py-0.5 rounded-full ml-0.5">
              RevenueCat
            </span>
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

      {/* Site Search Modal */}
      <SiteSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
