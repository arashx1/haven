import { useEffect, useRef } from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-xs animate-fadeIn"
      onClick={onCancel}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-ink-900 border border-cream-300 dark:border-ink-700 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-lift animate-scaleIn relative"
      >
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-5 right-5 text-ink-400 hover:text-ink-600 dark:hover:text-ink-200 transition cursor-pointer p-1"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              isDestructive
                ? 'bg-coral-100 text-coral-600 dark:bg-coral-950/60 dark:text-coral-400'
                : 'bg-honey-100 text-honey-600 dark:bg-honey-950/60 dark:text-honey-400'
            }`}
          >
            {isDestructive ? <AlertTriangle className="w-6 h-6" /> : <Info className="w-6 h-6" />}
          </div>

          <div className="flex-1 min-w-0 pr-6">
            <h2
              id="confirm-modal-title"
              className="text-xl font-display font-bold text-ink-800 dark:text-ink-100 mb-2 leading-snug"
            >
              {title}
            </h2>
            <p className="text-ink-600 dark:text-ink-300 text-sm sm:text-base leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-cream-200 dark:border-ink-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl font-bold text-ink-600 dark:text-ink-300 hover:bg-cream-100 dark:hover:bg-ink-800 transition cursor-pointer text-sm sm:text-base"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-white shadow-soft transition cursor-pointer text-sm sm:text-base active:scale-95 ${
              isDestructive
                ? 'bg-coral-600 hover:bg-coral-700'
                : 'bg-honey-500 hover:bg-honey-600'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
