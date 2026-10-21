import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface FormAlertProps {
  message?: string | null;
  onDismiss?: () => void;
  className?: string;
}

export function FormSuccessAlert({ message, onDismiss, className = '' }: FormAlertProps) {
  if (!message) return null;

  return (
    <div
      role="status"
      className={`flex items-start gap-3 p-4 rounded-2xl bg-sage-50 dark:bg-sage-950/40 border-2 border-sage-300 dark:border-sage-700/60 text-sage-900 dark:text-sage-100 animate-fadeIn shadow-xs ${className}`}
    >
      <CheckCircle2 className="w-5 h-5 text-sage-600 dark:text-sage-400 shrink-0 mt-0.5" />
      <div className="flex-1 text-sm sm:text-base font-semibold leading-relaxed">
        {message}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-sage-600 dark:text-sage-400 hover:text-sage-800 dark:hover:text-sage-200 p-0.5 transition cursor-pointer"
          aria-label="Dismiss message"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export function FormErrorAlert({ message, onDismiss, className = '' }: FormAlertProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-4 rounded-2xl bg-coral-50 dark:bg-coral-950/40 border-2 border-coral-300 dark:border-coral-700/60 text-coral-900 dark:text-coral-100 animate-fadeIn shadow-xs ${className}`}
    >
      <AlertCircle className="w-5 h-5 text-coral-600 dark:text-coral-400 shrink-0 mt-0.5" />
      <div className="flex-1 text-sm sm:text-base font-semibold leading-relaxed">
        {message}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-coral-600 dark:text-coral-400 hover:text-coral-800 dark:hover:text-coral-200 p-0.5 transition cursor-pointer"
          aria-label="Dismiss error"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export function FieldErrorMessage({ error }: { error?: string | null }) {
  if (!error) return null;
  return (
    <p className="flex items-center gap-1.5 text-xs sm:text-sm text-coral-600 dark:text-coral-400 font-bold mt-1.5 animate-fadeIn">
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
      <span>{error}</span>
    </p>
  );
}
