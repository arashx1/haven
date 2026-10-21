import { Loader2 } from 'lucide-react';

export function ButtonSpinner({ className = 'w-5 h-5' }: { className?: string }) {
  return <Loader2 className={`animate-spin shrink-0 ${className}`} />;
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="card-base p-6 border border-cream-200 dark:border-ink-800 space-y-3"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cream-200 dark:bg-ink-800 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-cream-200 dark:bg-ink-800 rounded-lg w-2/3" />
              <div className="h-4 bg-cream-100 dark:bg-ink-800/60 rounded-md w-1/3" />
            </div>
          </div>
          <div className="h-4 bg-cream-100 dark:bg-ink-800/50 rounded-md w-full" />
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-3xl p-5 bg-white/70 dark:bg-ink-800/40 border border-cream-200 dark:border-ink-700/60 space-y-3"
        >
          <div className="w-full h-36 rounded-2xl bg-cream-200 dark:bg-ink-700/60" />
          <div className="h-5 bg-cream-200 dark:bg-ink-700/60 rounded-lg w-3/4" />
          <div className="h-4 bg-cream-100 dark:bg-ink-800/80 rounded-md w-1/2" />
        </div>
      ))}
    </div>
  );
}
