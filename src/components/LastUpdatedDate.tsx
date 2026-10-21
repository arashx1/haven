import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface LastUpdatedDateProps {
  /** ISO date string or Date object. Defaults to the current time when first mounted. */
  date?: string | Date;
  /** Label prefix shown before the formatted date */
  label?: string;
  className?: string;
}

/**
 * Item 18 – Last Updated Date
 *
 * Renders a small "Last updated: <relative-or-absolute time>" badge.
 * Uses the Intl.RelativeTimeFormat API for human-friendly relative times
 * (e.g. "2 minutes ago") and falls back to a locale date string for older dates.
 *
 * Usage:
 *   <LastUpdatedDate />                          // "Last updated: just now"
 *   <LastUpdatedDate date="2026-10-21T10:00:00" />
 *   <LastUpdatedDate label="Profile synced" />
 */
export function LastUpdatedDate({
  date,
  label = 'Last updated',
  className = '',
}: LastUpdatedDateProps) {
  const [display, setDisplay] = useState('');

  useEffect(() => {
    const target = date ? new Date(date) : new Date();

    function format() {
      const now = Date.now();
      const diffMs = now - target.getTime();
      const diffSec = Math.round(diffMs / 1000);
      const diffMin = Math.round(diffSec / 60);
      const diffHr = Math.round(diffMin / 60);
      const diffDay = Math.round(diffHr / 24);

      if (diffSec < 5) return 'just now';
      if (diffSec < 60) return `${diffSec} seconds ago`;
      if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
      if (diffHr < 24) return `${diffHr} hour${diffHr !== 1 ? 's' : ''} ago`;
      if (diffDay < 7) return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
      // Older than a week – show absolute date
      return target.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    setDisplay(format());

    // Refresh every 30 s so the relative time stays accurate
    const interval = setInterval(() => setDisplay(format()), 30_000);
    return () => clearInterval(interval);
  }, [date]);

  if (!display) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs text-ink-400 dark:text-ink-500 font-medium ${className}`}
      title={date ? new Date(date).toLocaleString() : new Date().toLocaleString()}
    >
      <Clock className="w-3.5 h-3.5 shrink-0" />
      {label}: {display}
    </span>
  );
}
