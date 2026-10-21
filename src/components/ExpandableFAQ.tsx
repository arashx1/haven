import { useState } from 'react';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Care' | 'Privacy & Security';
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'General',
    question: 'How does Haven help someone living with memory loss or dementia?',
    answer:
      'Haven provides an ultra-calm, simplified experience with gentle audio reminders, recognizable family photos, routine ordering games, and soothing orientation cards ("You are safe and at home"). Everything is designed with large text, warm colors, and high contrast to reduce cognitive load and confusion.',
  },
  {
    id: 'faq-2',
    category: 'Care',
    question: 'Can caregivers and family members update reminders remotely?',
    answer:
      'Yes. Through the Caregiver Dashboard, family members or helpers can schedule medications, meals, doctor visits, and upload loved ones\' photos and stories. Changes synchronize automatically to the patient screen in real time.',
  },
  {
    id: 'faq-3',
    category: 'Care',
    question: 'What happens if the patient feels confused or overwhelmed?',
    answer:
      'Tapping the "Need Help?" button immediately shows a reassuring message ("You are safe. Your family is right beside you.") and offers instant 1-tap buttons to call family, alert a helper, or read the entire screen aloud in clear speech.',
  },
  {
    id: 'faq-4',
    category: 'Privacy & Security',
    question: 'Is health and family data kept private and secure?',
    answer:
      'Yes. Haven complies with strict HIPAA and GDPR standards. Data is encrypted in transit and at rest using enterprise Supabase security. Family memories and personal reminders are stored safely and never sold to third parties.',
  },
  {
    id: 'faq-5',
    category: 'General',
    question: 'Can Haven be customized for Parkinson’s or Stroke / Aphasia?',
    answer:
      'Absolutely! Haven features tailored condition modules. For Parkinson\'s, we enlarge tap targets and soften micro-vibrations; for Stroke/Aphasia, we provide picture-based communication boards and speech synthesis cards.',
  },
  {
    id: 'faq-6',
    category: 'General',
    question: 'Does Haven support multiple languages?',
    answer:
      'Yes! Haven natively supports English, Hindi, Bengali, Assamese, Spanish, French, and Chinese. You can switch languages at any moment using the globe menu in the top bar.',
  },
  {
    id: 'faq-7',
    category: 'Care',
    question: 'Can I print out the daily care schedule for doctors or visiting aides?',
    answer:
      'Yes. Haven includes a built-in print stylesheet. Clicking "Print Care Plan" formats today’s full schedule and emergency contacts into a crisp, high-contrast one-page document without screen clutter.',
  },
];

export function ExpandableFAQ() {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({ 'faq-1': true });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = ['All', 'General', 'Care', 'Privacy & Security'];

  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="card-base p-6 sm:p-8 animate-fadeIn border border-cream-300 dark:border-ink-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-honey-100 dark:bg-honey-900/40 flex items-center justify-center shrink-0">
          <HelpCircle className="w-6 h-6 text-honey-600 dark:text-honey-400" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-extrabold text-ink-800 dark:text-ink-100">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-ink-500 dark:text-ink-400">
            Quick answers about Haven care, privacy, and caregiver tools
          </p>
        </div>
      </div>

      {/* Search & Categories */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder="Search questions (e.g., privacy, reminders, print)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-cream-50 dark:bg-ink-800 border border-cream-300 dark:border-ink-700 text-sm focus:outline-none focus:border-honey-500 text-ink-800 dark:text-ink-100"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeCategory === cat
                  ? 'bg-honey-500 text-white shadow-xs'
                  : 'bg-cream-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 hover:bg-cream-200 dark:hover:bg-ink-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion list */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-6 text-ink-400 text-sm">
            No matching questions found. Try another search term or click Floating Contact below.
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = !!openIds[faq.id];
            return (
              <div
                key={faq.id}
                className="border border-cream-200 dark:border-ink-800 rounded-2xl overflow-hidden transition-all duration-200 bg-cream-50/50 dark:bg-ink-800/40"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between p-4 text-left font-bold text-ink-800 dark:text-ink-100 hover:text-honey-600 dark:hover:text-honey-400 transition cursor-pointer gap-3"
                >
                  <span className="text-base sm:text-lg leading-snug">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 text-ink-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-honey-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-ink-600 dark:text-ink-300 text-sm sm:text-base leading-relaxed border-t border-cream-200/60 dark:border-ink-700/60 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
