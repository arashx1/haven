import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 250);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      className="fixed bottom-24 right-4 sm:bottom-8 sm:right-8 z-40 p-3 rounded-full bg-white/90 dark:bg-ink-800/90 backdrop-blur-md text-honey-600 dark:text-honey-400 border-2 border-honey-300 dark:border-honey-700 shadow-lift hover:bg-honey-50 dark:hover:bg-ink-700 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer animate-scaleIn flex items-center justify-center group"
    >
      <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
    </button>
  );
}
