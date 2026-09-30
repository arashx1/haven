import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Sparkles,
  Calendar,
  Heart,
  Users,
  Brain,
  Shield,
  ArrowRight,
  ArrowLeft,
  LogIn,
  UserPlus,
  CheckCircle2,
  Clock,
  Phone,
  Type,
  Globe,
  ChevronRight,
  Sun,
  Smile,
} from 'lucide-react';

interface TourStep {
  id: string;
  badge: string;
  title: string;
  tagline: string;
  description: string;
  icon: typeof Sparkles;
  gradient: string;
  accentColor: string;
  points: string[];
  interactiveDemo?: {
    type: 'routine' | 'memory' | 'people' | 'games' | 'accessibility';
  };
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'intro',
    badge: 'Introduction',
    title: 'Welcome to Haven',
    tagline: 'A gentle, dignified companion designed for memory support.',
    description:
      'Haven is crafted specifically for elderly individuals, those living with mild cognitive impairment or dementia, and their dedicated family caregivers. It replaces stress and confusion with warmth, clarity, and daily rhythm.',
    icon: Sun,
    gradient: 'from-honey-400 to-honey-600',
    accentColor: 'text-honey-600',
    points: [
      'Calm, soothing color palette — zero sensory overwhelm',
      'Tactile, large buttons with crystal-clear icons',
      'Global multilingual support (Chinese, French, Spanish, English, etc.) with instant text resizing',
      'Bridges the care gap between patients and their families',
    ],
  },
  {
    id: 'my-day',
    badge: 'Feature 1 of 5',
    title: 'My Day & Routine Reminders',
    tagline: 'Structure every day with clarity, joy, and peace of mind.',
    description:
      'Forgetting daily schedules or medications creates immense anxiety. "My Day" gives patients a single, clean chronological view of today\'s events with comforting audio prompts and clear pill illustrations.',
    icon: Calendar,
    gradient: 'from-amber-400 to-amber-600',
    accentColor: 'text-amber-600',
    points: [
      'Visual timeline: Morning, Lunch, Afternoon, and Evening blocks',
      'Medication alerts with exact dosage, pill shapes, and instructions',
      'One-tap "I have taken this" checkoff with positive encouragement',
      'Voice-ready cues to guide the patient without feeling rushed',
    ],
    interactiveDemo: { type: 'routine' },
  },
  {
    id: 'memories',
    badge: 'Feature 2 of 5',
    title: 'Memories & Photo Album',
    tagline: 'Reminiscence therapy that brings comfort and anchors identity.',
    description:
      'Photos and cherished family stories help counteract sundowning and memory fog. Patients can easily browse meaningful milestones curated by their family, complete with dates, warm captions, and familiar voices.',
    icon: Heart,
    gradient: 'from-coral-400 to-coral-600',
    accentColor: 'text-coral-600',
    points: [
      'High-contrast photo cards with simple, comforting stories',
      'Familiar milestones: weddings, holidays, grandchildren\'s birthdays',
      'Gentle questions that stimulate positive feelings and reflection',
      'Calming visual browsing designed to ease agitation',
    ],
    interactiveDemo: { type: 'memory' },
  },
  {
    id: 'people',
    badge: 'Feature 3 of 5',
    title: 'Familiar People & Faces',
    tagline: 'Never feel lost when loved ones or caregivers walk in.',
    description:
      'Recognizing family members, doctors, and neighbors becomes easier. Each card showcases their picture, name, relationship ("Your Daughter"), and a 1-tap call button so help is always right at hand.',
    icon: Users,
    gradient: 'from-emerald-400 to-emerald-600',
    accentColor: 'text-emerald-600',
    points: [
      'Prominent portrait cards with clear relationship badges',
      'One-tap instant phone call directly to the caregiver',
      'Reminders of shared nicknames, hobbies, and favorite topics',
      'Reduces the anxiety of asking "Who are you?"',
    ],
    interactiveDemo: { type: 'people' },
  },
  {
    id: 'games',
    badge: 'Feature 4 of 5',
    title: 'Gentle Mind & Brain Games',
    tagline: 'Cognitive exercise with zero pressure and 100% encouragement.',
    description:
      'Engaging activities like picture matching and face recognition stimulate neuroplasticity and bring smiles without any stressful timers, negative scores, or complex rules.',
    icon: Brain,
    gradient: 'from-indigo-400 to-indigo-600',
    accentColor: 'text-indigo-600',
    points: [
      'Picture Matching: Pair familiar animals, fruits, and objects',
      'Familiar Faces Quiz: Joyful recognition of loved ones',
      'Always positive feedback with gentle celebratory animations',
      'Can be played independently or together with a visiting grandchild',
    ],
    interactiveDemo: { type: 'games' },
  },
  {
    id: 'caregiver',
    badge: 'Feature 5 of 6',
    title: 'Caregiver Portal & Accessibility',
    tagline: 'Peace of mind for families, complete accessibility for patients.',
    description:
      'Family members can remotely add reminders, upload new photos, and monitor whether medicines were taken. The app also features instantaneous 4-level text resizing and 7 global & regional languages.',
    icon: Shield,
    gradient: 'from-teal-400 to-teal-600',
    accentColor: 'text-teal-600',
    points: [
      'Secure Caregiver Dashboard with emergency contact controls',
      'Top-bar A- / A+ text enlargement for effortless reading',
      'Native translations in English, Chinese (新加坡中文), French (Français), Spanish (Español), Hindi, Bengali, and Assamese',
      'Powered by resilient cloud sync and instant offline demo fallback',
    ],
    interactiveDemo: { type: 'accessibility' },
  },
  {
    id: 'subscriptions',
    badge: 'Feature 6 of 6',
    title: 'Subscriptions & Family Tiers',
    tagline: 'Powered by RevenueCat Web SDK (@revenuecat/purchases-js).',
    description:
      'Haven integrates the official RevenueCat Web SDK to provide tiered plans: Haven Plus for individuals and Haven Family for multi-caregiver households, supporting offerings, customer entitlements, and paywalls.',
    icon: Sparkles,
    gradient: 'from-amber-400 to-amber-600',
    accentColor: 'text-amber-600',
    points: [
      'Official RevenueCat Web SDK integration (@revenuecat/purchases-js)',
      'Tiered plans: Haven Plus ($9.99/mo) & Haven Family ($19.99/mo)',
      'Entitlements-based feature gating for games, routines, and memories',
      'Integrated Paywall Modal with monthly/annual toggle and restore flow',
    ],
  },
  {
    id: 'get-started',
    badge: 'Ready to Use',
    title: 'Universal Access & Demo Ready!',
    tagline: 'Log in, create an account, or test immediately with 1-click quick demo.',
    description:
      'Haven works seamlessly with Supabase cloud database, and features instant zero-config login for immediate hackathon and judge evaluations.',
    icon: Sparkles,
    gradient: 'from-honey-500 to-coral-500',
    accentColor: 'text-honey-600',
    points: [
      'Zero-Config Hackathon Review: 1-click quick demo login',
      'Cloud Database Support: Profiles, Reminders, Memories, People & Games',
      'Instant accessibility: Font scaling & international languages from any screen',
      'Full Security: Row-level security protects your family data',
    ],
  },
];

export function DemoPage() {
  const { navigate, openAuthGate, session } = useApp();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const step = TOUR_STEPS[currentStepIndex];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (!isLast) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const StepIcon = step.icon;

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col justify-between py-6 px-4 sm:px-6">
      {/* Top Header */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between pb-4 border-b border-cream-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-honey-400 to-honey-600 flex items-center justify-center shadow-warm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-ink-800 text-xl leading-tight">
              Interactive Product Tour
            </h1>
            <p className="text-ink-400 text-xs sm:text-sm">Explore all features of Haven</p>
          </div>
        </div>

        <button
          onClick={() => navigate('login')}
          className="text-ink-500 hover:text-ink-800 font-bold text-sm sm:text-base flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-cream-200 transition"
        >
          <span>Skip to Login</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </header>

      {/* Main Tour Card Container */}
      <main className="max-w-4xl w-full mx-auto my-6 flex-1 flex flex-col justify-center">
        {/* Step Indicator Progress Pills */}
        <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
          {TOUR_STEPS.map((s, idx) => {
            const active = idx === currentStepIndex;
            const completed = idx < currentStepIndex;
            return (
              <button
                key={s.id}
                onClick={() => setCurrentStepIndex(idx)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  active
                    ? 'w-10 bg-honey-500 shadow-sm'
                    : completed
                    ? 'w-4 bg-honey-300 hover:bg-honey-400'
                    : 'w-3 bg-cream-300 hover:bg-cream-400'
                }`}
                aria-label={`Go to step ${idx + 1}: ${s.title}`}
              />
            );
          })}
        </div>

        {/* Dynamic Modal / Card for Current Step */}
        <div className="card-base p-6 sm:p-10 shadow-lift border border-cream-200 animate-scaleIn bg-white relative overflow-hidden">
          {/* Decorative Background Blob */}
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-honey-100/50 pointer-events-none blur-2xl" />

          {/* Badge & Step Number */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-100 text-ink-600 font-bold text-xs uppercase tracking-wider border border-cream-300">
              <StepIcon className="w-3.5 h-3.5 text-honey-600" />
              {step.badge}
            </span>
            <span className="text-ink-400 font-bold text-sm">
              Step {currentStepIndex + 1} of {TOUR_STEPS.length}
            </span>
          </div>

          {/* Step Header */}
          <div className="flex items-start gap-4 mb-6">
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-warm shrink-0`}
            >
              <StepIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h2 className="section-title text-2xl sm:text-3xl text-ink-900 mb-1">
                {step.title}
              </h2>
              <p className="text-ink-500 font-medium text-base sm:text-lg">
                {step.tagline}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-ink-700 text-base sm:text-lg leading-relaxed mb-6">
            {step.description}
          </p>

          {/* Interactive Feature Preview / Demonstration Box */}
          {step.interactiveDemo && (
            <div className="mb-6 bg-cream-50 border-2 border-dashed border-cream-300 rounded-2xl p-4 sm:p-5">
              <p className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Smile className="w-4 h-4 text-honey-600" />
                Live Interactive Feature Preview
              </p>

              {step.interactiveDemo.type === 'routine' && (
                <div
                  onClick={() => openAuthGate('mark medications as done')}
                  className="cursor-pointer p-4 rounded-xl border-2 border-honey-300 hover:border-honey-500 shadow-sm bg-white transition flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-honey-100 flex items-center justify-center text-honey-600 font-bold text-xl shrink-0">
                      💊
                    </div>
                    <div>
                      <p className="font-bold text-lg text-ink-800">
                        Morning Blood Pressure Pill
                      </p>
                      <p className="text-sm text-ink-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> 9:00 AM • Take with warm water
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl font-bold text-sm bg-honey-500 text-white hover:bg-honey-600 transition"
                    onClick={(e) => { e.stopPropagation(); openAuthGate('mark medications as done'); }}
                  >
                    Tap to Mark Done
                  </button>
                </div>
              )}

              {step.interactiveDemo.type === 'memory' && (
                <div className="bg-white rounded-xl p-4 border border-cream-200 shadow-sm flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-coral-200 to-honey-200 flex items-center justify-center text-3xl shrink-0 shadow-inner">
                    🌸
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <div className="inline-block bg-honey-100 text-honey-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full mb-1">
                      Year 2018
                    </div>
                    <p className="font-bold text-ink-800 text-lg">Priya\'s Graduation Day</p>
                    <p className="text-ink-500 text-sm">
                      "You were so proud watching your daughter receive her gold medal."
                    </p>
                  </div>
                </div>
              )}

              {step.interactiveDemo.type === 'people' && (
                <div className="bg-white rounded-xl p-4 border border-cream-200 shadow-sm flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center text-2xl font-bold">
                      👩
                    </div>
                    <div>
                      <p className="font-bold text-ink-800 text-lg">Priya Sharma</p>
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-md">
                        Your Daughter
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => openAuthGate('call family members')}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition"
                  >
                    <Phone className="w-4 h-4" />
                    Call Priya
                  </button>
                </div>
              )}

              {step.interactiveDemo.type === 'games' && (
                <div className="grid grid-cols-3 gap-2">
                  {['🦁 Lion', '🐘 Elephant', '🦁 Match!'].map((card, i) => (
                    <div
                      key={i}
                      onClick={() => openAuthGate('play memory games')}
                      className="bg-white border-2 border-indigo-200 rounded-xl p-3 text-center font-bold text-ink-700 text-sm hover:border-indigo-500 cursor-pointer shadow-sm transition"
                    >
                      {card}
                    </div>
                  ))}
                </div>
              )}

              {step.interactiveDemo.type === 'accessibility' && (
                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-cream-200">
                  <div className="flex items-center gap-2 text-ink-700 font-semibold text-sm">
                    <Type className="w-4 h-4 text-honey-600" />
                    <span>Instant Text Sizing (A− / A+)</span>
                  </div>
                  <div className="flex items-center gap-2 text-ink-700 font-semibold text-sm">
                    <Globe className="w-4 h-4 text-honey-600" />
                    <span>7 Global & Regional Languages</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Key Bullet Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {step.points.map((pt, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${step.accentColor}`} />
                <span className="text-ink-700 font-medium text-sm sm:text-base leading-snug">
                  {pt}
                </span>
              </div>
            ))}
          </div>

          {/* Special Actions on the Final Step */}
          {isLast ? (
            <div className="bg-gradient-to-r from-cream-100 to-honey-50 border border-honey-200 rounded-2xl p-6 text-center space-y-4">
              {session ? (
                <>
                  <h3 className="text-xl font-bold text-ink-800">You're all set! 🎉</h3>
                  <p className="text-ink-500 text-sm">You're already logged in. Head back to your dashboard to use all features.</p>
                  <button
                    onClick={() => navigate('my-day')}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-lg"
                  >
                    <LogIn className="w-5 h-5" />
                    Go to My Dashboard
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-ink-800">Ready to Get Started?</h3>
                  <p className="text-ink-500 text-sm">Create a free account or test immediately with 1-click Demo.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => navigate('signup')}
                      className="btn-primary flex items-center justify-center gap-2 py-3 text-lg"
                    >
                      <UserPlus className="w-5 h-5" />
                      Create Free Account
                    </button>
                    <button
                      onClick={() => navigate('login')}
                      className="btn-secondary flex items-center justify-center gap-2 py-3 text-lg border-2 border-honey-400 text-honey-700 hover:bg-honey-100"
                    >
                      <LogIn className="w-5 h-5" />
                      Log In / Quick Demo
                    </button>
                  </div>
                </>
              )}
              <p className="text-xs text-ink-400">
                Universal Demo & Cloud Database Ready • Instant Access
              </p>
            </div>
          ) : (
            /* Navigation Buttons between Steps */
            <div className="flex items-center justify-between pt-4 border-t border-cream-200 gap-3">
              <button
                onClick={handlePrev}
                disabled={isFirst}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-base transition ${
                  isFirst
                    ? 'opacity-40 cursor-not-allowed text-ink-300'
                    : 'text-ink-700 hover:bg-cream-100 active:scale-95'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
                Previous
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentStepIndex(TOUR_STEPS.length - 1)}
                  className="text-ink-400 hover:text-ink-700 font-semibold text-sm px-3 py-2"
                >
                  Jump to End
                </button>
                <button
                  onClick={handleNext}
                  className="btn-primary flex items-center gap-2 px-6 py-3 text-lg"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl w-full mx-auto text-center text-xs text-ink-400 pt-2">
        Haven Assistive Health & Memory Companion • RevenueCat Ship-a-ton 2026
      </footer>
    </div>
  );
}
