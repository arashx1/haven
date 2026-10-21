import { useState, useEffect } from 'react';

export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) {
        setProgress(0);
        return;
      }
      const scrolled = (window.scrollY / scrollHeight) * 100;
      setProgress(Math.min(100, Math.max(0, scrolled)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (progress <= 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 z-50 pointer-events-none bg-cream-200/40 dark:bg-ink-800/40"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-honey-400 via-honey-500 to-amber-600 transition-all duration-75 ease-out shadow-[0_0_8px_rgba(217,119,46,0.5)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
