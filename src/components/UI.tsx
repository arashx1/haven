import { type ReactNode } from 'react';
import { ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function PageHeader({
  title,
  subtitle,
  icon,
  showBack = true,
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  showBack?: boolean;
}) {
  const { goBack } = useApp();
  return (
    <div className="flex items-center gap-4 mb-6">
      {showBack && (
        <button
          onClick={goBack}
          className="flex items-center gap-2 bg-cream-100 hover:bg-cream-200 text-ink-700 font-bold rounded-2xl px-5 py-3.5 border-2 border-cream-300 transition active:scale-95 text-lg shrink-0"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="hidden sm:inline">Back</span>
        </button>
      )}
      <div className="flex items-center gap-3 min-w-0">
        {icon && <div className="shrink-0">{icon}</div>}
        <div className="min-w-0">
          <h1 className="section-title text-2xl sm:text-3xl leading-tight truncate">{title}</h1>
          {subtitle && <p className="text-ink-500 text-base sm:text-lg">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

export function SuccessToast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-ink-900/40 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-lift p-8 max-w-md w-full text-center animate-scaleIn">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-sage-100 flex items-center justify-center">
          <span className="text-5xl">⭐</span>
        </div>
        <p className="text-2xl font-display font-extrabold text-ink-800 mb-2">Great job!</p>
        <p className="text-lg text-ink-600 mb-6">{message}</p>
        <button onClick={onClose} className="btn-success w-full">
          Okay
        </button>
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, message }: { icon: ReactNode; title: string; message: string }) {
  return (
    <div className="card-base p-10 text-center">
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-cream-200 flex items-center justify-center text-ink-400">
        {icon}
      </div>
      <p className="text-xl font-bold text-ink-700 mb-1">{title}</p>
      <p className="text-lg text-ink-500">{message}</p>
    </div>
  );
}

export function LoadingState({ message = 'Please wait a moment...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fadeIn">
      <div className="w-16 h-16 rounded-full border-4 border-cream-200 border-t-honey-500 animate-spin" />
      <p className="text-lg text-ink-500 font-semibold mt-4">{message}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="card-base p-8 text-center border-2 border-coral-200">
      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-coral-100 flex items-center justify-center">
        <AlertCircle className="w-9 h-9 text-coral-600" />
      </div>
      <p className="text-xl font-bold text-ink-700 mb-1">Something went wrong</p>
      <p className="text-lg text-ink-500 mb-4">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary text-base px-6 py-3">
          <RefreshCw className="w-5 h-5" />
          Try Again
        </button>
      )}
    </div>
  );
}
