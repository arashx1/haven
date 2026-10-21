import { useState } from 'react';
import { Phone, Mail, MessageSquare, Send, CheckCircle2, X } from 'lucide-react';
import { ButtonSpinner } from './LoadingAnimations';
import { FormSuccessAlert, FormErrorAlert, FieldErrorMessage } from './FormAlerts';
import { CopyButton } from './CopyButton';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [topic, setTopic] = useState('caregiver_support');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = 'Please enter your name.';
    if (!contactInfo.trim()) errors.contact = 'Please enter your email or phone number.';
    if (!message.trim()) {
      errors.message = 'Please enter a message.';
    } else if (message.trim().length < 5) {
      errors.message = 'Message must be at least 5 characters.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!validate()) {
      setErrorMsg('Please correct the highlighted fields below.');
      return;
    }

    setLoading(true);

    // Simulate async submission with pleasant delay
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg(
        'Thank you! Your message has been dispatched to the Haven Care Support Team. We will reach out within a few hours.'
      );
      setName('');
      setContactInfo('');
      setMessage('');
      setFieldErrors({});
    }, 800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Contact Haven Care Team"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-ink-900 border border-cream-300 dark:border-ink-700 rounded-3xl max-w-lg w-full shadow-lift overflow-hidden animate-scaleIn relative flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-cream-200 dark:border-ink-800 bg-cream-50/80 dark:bg-ink-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-honey-100 dark:bg-honey-900/40 flex items-center justify-center text-honey-600 dark:text-honey-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-display font-extrabold text-ink-800 dark:text-ink-100">
                Contact Haven Care
              </h2>
              <p className="text-xs text-ink-500 dark:text-ink-400">
                24/7 Assistance for families and caregivers
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-ink-400 hover:text-ink-600 dark:hover:text-ink-200 hover:bg-cream-100 dark:hover:bg-ink-800 transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-6 space-y-5 flex-1">
          {/* Quick Hotline Card */}
          <div className="p-4 rounded-2xl bg-sage-50/70 dark:bg-sage-950/30 border border-sage-200 dark:border-sage-800/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sage-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-sage-800 dark:text-sage-200 uppercase tracking-wide">
                  24/7 Care Helpline
                </p>
                <p className="text-base font-extrabold text-sage-900 dark:text-sage-100">
                  +1 (800) 428-3622
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CopyButton text="+1-800-428-3622" label="Copy" size="sm" />
              <a
                href="tel:18004283622"
                className="px-3 py-1.5 rounded-xl bg-sage-600 hover:bg-sage-700 text-white text-xs font-bold shadow-xs transition"
              >
                Call
              </a>
            </div>
          </div>

          {/* Form Success & Error Alerts */}
          <FormSuccessAlert
            message={successMsg}
            onDismiss={() => setSuccessMsg(null)}
          />
          <FormErrorAlert
            message={errorMsg}
            onDismiss={() => setErrorMsg(null)}
          />

          {/* Message Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="contact-name"
                className="block text-sm font-bold text-ink-700 dark:text-ink-200 mb-1"
              >
                Your Name <span className="text-coral-500">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                placeholder="e.g., Sarah Vance"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: '' }));
                }}
                className={`w-full rounded-2xl border-2 bg-cream-50/50 dark:bg-ink-800 px-4 py-2.5 text-sm sm:text-base focus:outline-none transition text-ink-800 dark:text-ink-100 ${
                  fieldErrors.name
                    ? 'border-coral-400 bg-coral-50/20 ring-2 ring-coral-200'
                    : 'border-cream-300 dark:border-ink-700 focus:border-honey-500'
                }`}
              />
              <FieldErrorMessage error={fieldErrors.name} />
            </div>

            <div>
              <label
                htmlFor="contact-info"
                className="block text-sm font-bold text-ink-700 dark:text-ink-200 mb-1"
              >
                Email or Phone <span className="text-coral-500">*</span>
              </label>
              <input
                id="contact-info"
                type="text"
                placeholder="e.g., sarah@example.com or (555) 123-4567"
                value={contactInfo}
                onChange={(e) => {
                  setContactInfo(e.target.value);
                  if (fieldErrors.contact) setFieldErrors((prev) => ({ ...prev, contact: '' }));
                }}
                className={`w-full rounded-2xl border-2 bg-cream-50/50 dark:bg-ink-800 px-4 py-2.5 text-sm sm:text-base focus:outline-none transition text-ink-800 dark:text-ink-100 ${
                  fieldErrors.contact
                    ? 'border-coral-400 bg-coral-50/20 ring-2 ring-coral-200'
                    : 'border-cream-300 dark:border-ink-700 focus:border-honey-500'
                }`}
              />
              <FieldErrorMessage error={fieldErrors.contact} />
            </div>

            <div>
              <label
                htmlFor="contact-topic"
                className="block text-sm font-bold text-ink-700 dark:text-ink-200 mb-1"
              >
                Subject
              </label>
              <select
                id="contact-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full rounded-2xl border-2 border-cream-300 dark:border-ink-700 bg-cream-50/50 dark:bg-ink-800 px-4 py-2.5 text-sm sm:text-base text-ink-800 dark:text-ink-100 focus:border-honey-500 focus:outline-none transition"
              >
                <option value="caregiver_support">Caregiver &amp; Patient Setup</option>
                <option value="routine_help">Medication &amp; Daily Routine Question</option>
                <option value="account_subscription">Subscription &amp; RevenueCat Support</option>
                <option value="feedback">Product Feedback or Feature Request</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block text-sm font-bold text-ink-700 dark:text-ink-200 mb-1"
              >
                Message <span className="text-coral-500">*</span>
              </label>
              <textarea
                id="contact-message"
                rows={3}
                placeholder="How can we help you or your loved one today?"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (fieldErrors.message) setFieldErrors((prev) => ({ ...prev, message: '' }));
                }}
                className={`w-full rounded-2xl border-2 bg-cream-50/50 dark:bg-ink-800 px-4 py-2.5 text-sm sm:text-base focus:outline-none transition text-ink-800 dark:text-ink-100 ${
                  fieldErrors.message
                    ? 'border-coral-400 bg-coral-50/20 ring-2 ring-coral-200'
                    : 'border-cream-300 dark:border-ink-700 focus:border-honey-500'
                }`}
              />
              <FieldErrorMessage error={fieldErrors.message} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base sm:text-lg shadow-warm cursor-pointer"
            >
              {loading ? (
                <>
                  <ButtonSpinner />
                  <span>Sending message...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
