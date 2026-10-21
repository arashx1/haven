import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { ContactModal } from './ContactModal';

/**
 * Item 20 – Floating Contact Button
 * Fixed button pinned to bottom-right that opens the ContactModal.
 */
export function FloatingContactButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        id="floating-contact-btn"
        onClick={() => setOpen(true)}
        aria-label="Floating Contact Button"
        title="Contact Haven Care Team"
        className="fixed bottom-8 right-4 sm:right-6 z-30 w-14 h-14 rounded-full bg-honey-500 hover:bg-honey-600 text-white shadow-lift flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer animate-pulse-subtle group"
        style={{
          // Keep above BackToTop which is z-40; this sits at z-30 but pinned further down
          bottom: open ? '2rem' : undefined,
        }}
      >
        {open ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
        )}
      </button>

      <ContactModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
