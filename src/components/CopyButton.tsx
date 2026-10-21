import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function CopyButton({
  text,
  label = 'Copy',
  copiedLabel = 'Copied!',
  className = '',
  iconOnly = false,
  size = 'md',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-999999px';
        textarea.style.top = '-999999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Failed to copy text:', err);
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2',
  }[size];

  const iconSize = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 cursor-pointer active:scale-95 border ${
        copied
          ? 'bg-sage-100 text-sage-800 border-sage-300 dark:bg-sage-900/40 dark:text-sage-200 dark:border-sage-700'
          : 'bg-white hover:bg-cream-100 dark:bg-ink-800 dark:hover:bg-ink-700 text-ink-700 dark:text-ink-200 border-cream-300 dark:border-ink-700 hover:border-honey-300'
      } ${sizeClasses} ${className}`}
      title={copied ? copiedLabel : `Copy "${text}"`}
      aria-label={copied ? copiedLabel : label}
    >
      {copied ? (
        <Check className={`${iconSize} text-sage-600 dark:text-sage-300 shrink-0 animate-scaleIn`} />
      ) : (
        <Copy className={`${iconSize} text-ink-400 dark:text-ink-400 shrink-0 group-hover:text-honey-600`} />
      )}
      {!iconOnly && <span>{copied ? copiedLabel : label}</span>}
    </button>
  );
}
