import { useState, useEffect, useRef } from 'react';
import { useApp, type Route } from '@/context/AppContext';
import {
  Search,
  X,
  Home,
  Brain,
  Images,
  Users,
  LifeBuoy,
  LayoutDashboard,
  Sparkles,
  Crown,
  Bell,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Page' | 'Reminder' | 'Contact' | 'Memory' | 'FAQ';
  icon: typeof Home;
  action: () => void;
}

export function SiteSearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { navigate, openPaywall } = useApp();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger open via custom event or context
          window.dispatchEvent(new CustomEvent('haven_open_search'));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const searchItems: SearchResultItem[] = [
    // Pages
    {
      id: 'page-my-day',
      title: 'My Day (Daily Schedule & Orientations)',
      subtitle: 'See today\'s routine, time, weather, and upcoming tasks',
      category: 'Page',
      icon: Home,
      action: () => {
        navigate('my-day');
        onClose();
      },
    },
    {
      id: 'page-play',
      title: 'Brain Games & Calm Play',
      subtitle: 'Memory Match, Bubble Catch, Routine Order, and Zen Bloom',
      category: 'Page',
      icon: Brain,
      action: () => {
        navigate('play');
        onClose();
      },
    },
    {
      id: 'page-memories',
      title: 'Family Memories & Photo Albums',
      subtitle: 'View loved ones, cherished moments, and audio stories',
      category: 'Page',
      icon: Images,
      action: () => {
        navigate('memories');
        onClose();
      },
    },
    {
      id: 'page-people',
      title: 'My People & Familiar Contacts',
      subtitle: 'Family members, doctors, and helpers with one-tap calling',
      category: 'Page',
      icon: Users,
      action: () => {
        navigate('people');
        onClose();
      },
    },
    {
      id: 'page-help',
      title: 'Need Help & Emergency Support',
      subtitle: 'Reassurance message, read aloud, and instant family alert',
      category: 'Page',
      icon: LifeBuoy,
      action: () => {
        navigate('help');
        onClose();
      },
    },
    {
      id: 'page-caregiver',
      title: 'Caregiver & Helper Dashboard',
      subtitle: 'Manage medication reminders, schedule, and patient profile',
      category: 'Page',
      icon: LayoutDashboard,
      action: () => {
        navigate('caregiver-dashboard');
        onClose();
      },
    },
    {
      id: 'page-tour',
      title: 'Interactive Feature Tour',
      subtitle: 'Step-by-step interactive walkthrough of all Haven capabilities',
      category: 'Page',
      icon: Sparkles,
      action: () => {
        navigate('demo');
        onClose();
      },
    },
    {
      id: 'page-upgrade',
      title: 'Haven Caregiver Pro Subscription',
      subtitle: 'Unlimited games, multi-caregiver syncing, and audio prompts',
      category: 'Page',
      icon: Crown,
      action: () => {
        openPaywall();
        onClose();
      },
    },

    // Reminders
    {
      id: 'rem-vitamins',
      title: 'Morning Heart Medication & Vitamins',
      subtitle: '8:00 AM • Take with a full glass of water',
      category: 'Reminder',
      icon: Bell,
      action: () => {
        navigate('my-day');
        onClose();
      },
    },
    {
      id: 'rem-walk',
      title: 'Gentle Garden Stroll & Sunshine',
      subtitle: '10:30 AM • 15 minutes of fresh air in the garden',
      category: 'Reminder',
      icon: Bell,
      action: () => {
        navigate('my-day');
        onClose();
      },
    },
    {
      id: 'rem-doctor',
      title: 'Dr. Robert Checkup Call',
      subtitle: '2:00 PM • Routine telephone health consultation',
      category: 'Reminder',
      icon: Bell,
      action: () => {
        navigate('my-day');
        onClose();
      },
    },

    // Contacts
    {
      id: 'contact-sarah',
      title: 'Sarah Vance (Daughter)',
      subtitle: 'Primary contact • Calls every morning at 9:00 AM',
      category: 'Contact',
      icon: Users,
      action: () => {
        navigate('people');
        onClose();
      },
    },
    {
      id: 'contact-dr-robert',
      title: 'Dr. Robert Chen (Neurologist)',
      subtitle: 'Memory Care Clinic • 555-0199',
      category: 'Contact',
      icon: Users,
      action: () => {
        navigate('people');
        onClose();
      },
    },

    // FAQ
    {
      id: 'faq-privacy',
      title: 'Is Haven HIPAA & GDPR Safe?',
      subtitle: 'Encrypted storage for family photos, routine data, and medical notes',
      category: 'FAQ',
      icon: HelpCircle,
      action: () => {
        navigate('help');
        onClose();
      },
    },
    {
      id: 'faq-offline',
      title: 'How does Haven work offline or with low internet?',
      subtitle: 'On-device caching ensures routines and emergency contacts remain accessible',
      category: 'FAQ',
      icon: HelpCircle,
      action: () => {
        navigate('help');
        onClose();
      },
    },
  ];

  const filtered = query.trim()
    ? searchItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : searchItems;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < filtered.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Site Search"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-ink-900/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-ink-900 border border-cream-300 dark:border-ink-700 rounded-3xl max-w-xl w-full shadow-lift overflow-hidden animate-scaleIn flex flex-col max-h-[80vh]"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 p-4 sm:p-5 border-b border-cream-200 dark:border-ink-800 bg-cream-50/60 dark:bg-ink-900">
          <Search className="w-6 h-6 text-honey-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, routines, contacts, or FAQs..."
            className="flex-1 bg-transparent border-none text-base sm:text-lg font-bold text-ink-800 dark:text-ink-100 placeholder-ink-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-ink-400 hover:text-ink-600 dark:hover:text-ink-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block px-2 py-1 text-[11px] font-bold text-ink-400 bg-cream-200/80 dark:bg-ink-800 rounded-lg">
            ESC to close
          </span>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-ink-400 dark:text-ink-500">
              <Search className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="font-bold text-base">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-sm mt-1">Try searching for &quot;medication&quot;, &quot;doctor&quot;, &quot;games&quot;, or &quot;help&quot;</p>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center gap-3.5 p-3 rounded-2xl text-left transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-honey-100/80 dark:bg-honey-950/50 text-honey-900 dark:text-honey-200 shadow-xs'
                      : 'hover:bg-cream-100 dark:hover:bg-ink-800 text-ink-700 dark:text-ink-200'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-honey-500 text-white shadow-xs'
                        : 'bg-cream-200 dark:bg-ink-800 text-ink-600 dark:text-ink-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm sm:text-base truncate">{item.title}</p>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cream-200 dark:bg-ink-700 text-ink-600 dark:text-ink-300 shrink-0 uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-ink-500 dark:text-ink-400 truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'translate-x-1 text-honey-600 dark:text-honey-400' : 'text-ink-300 dark:text-ink-600'
                    }`}
                  />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-cream-100/70 dark:bg-ink-950 border-t border-cream-200 dark:border-ink-800 flex items-center justify-between text-xs text-ink-500 dark:text-ink-400 px-4">
          <span>Use &uarr; &darr; to navigate</span>
          <span>Press Enter to select</span>
        </div>
      </div>
    </div>
  );
}
