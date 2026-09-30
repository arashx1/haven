import { useApp, type OnboardingStep } from '@/context/AppContext';
import { LANGUAGES, type Language } from '@/data/mockData';
import {
  Heart,
  Globe,
  Check,
  ChevronRight,
  ArrowLeft,
  UserPlus,
  Bell,
  Calendar,
  Brain,
  Images,
  Users,
  LifeBuoy,
  Sparkles,
} from 'lucide-react';

const TOTAL_STEPS: OnboardingStep = 5;

export function OnboardingPage() {
  const { onboardingStep, setOnboardingStep, setAuthState, navigate, patientName, language, setLanguage } = useApp();

  const finishOnboarding = () => {
    setAuthState('authenticated');
    navigate('my-day');
  };

  const nextStep = () => {
    if (onboardingStep < TOTAL_STEPS) {
      setOnboardingStep((onboardingStep + 1) as OnboardingStep);
    } else {
      finishOnboarding();
    }
  };

  const prevStep = () => {
    if (onboardingStep > 0) {
      setOnboardingStep((onboardingStep - 1) as OnboardingStep);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      {/* Progress bar */}
      <div className="bg-white border-b border-cream-200">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 bg-cream-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-honey-400 to-honey-500 rounded-full transition-all duration-500"
                style={{ width: `${((onboardingStep + 1) / (TOTAL_STEPS + 1)) * 100}%` }}
              />
            </div>
            <span className="text-ink-400 font-bold text-sm whitespace-nowrap">
              {onboardingStep + 1} of {TOTAL_STEPS + 1}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          {onboardingStep === 0 && <StepWelcome patientName={patientName} onNext={nextStep} />}
          {onboardingStep === 1 && <StepLanguage language={language} setLanguage={setLanguage} onNext={nextStep} onPrev={prevStep} />}
          {onboardingStep === 2 && <StepAddPeople onNext={nextStep} onPrev={prevStep} />}
          {onboardingStep === 3 && <StepAddReminders onNext={nextStep} onPrev={prevStep} />}
          {onboardingStep === 4 && <StepFeatures onNext={nextStep} onPrev={prevStep} />}
          {onboardingStep === 5 && <StepFinish patientName={patientName} onFinish={finishOnboarding} onPrev={prevStep} />}
        </div>
      </div>
    </div>
  );
}

function StepWrapper({ children, onPrev, onNext, nextLabel = 'Continue', showPrev = true }: {
  children: React.ReactNode;
  onPrev?: () => void;
  onNext: () => void;
  nextLabel?: string;
  showPrev?: boolean;
}) {
  return (
    <div className="card-base p-8 animate-scaleIn">
      {children}
      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        {showPrev && onPrev && (
          <button onClick={onPrev} className="btn-secondary flex-1 text-lg">
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        )}
        <button onClick={onNext} className="btn-primary flex-1 text-xl">
          {nextLabel}
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

function StepWelcome({ patientName, onNext }: { patientName: string; onNext: () => void }) {
  return (
    <StepWrapper onNext={onNext} nextLabel="Let's Begin" showPrev={false}>
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-honey-100 flex items-center justify-center">
          <Heart className="w-10 h-10 text-honey-600" />
        </div>
        <h1 className="section-title text-3xl mb-3">Welcome, {patientName} ❤️</h1>
        <p className="text-xl text-ink-600 leading-relaxed">
          We will help you set up your companion in a few simple steps.
        </p>
        <p className="text-lg text-ink-400 mt-3">
          This will only take a few minutes. You can always change things later.
        </p>
      </div>
    </StepWrapper>
  );
}

function StepLanguage({ language, setLanguage, onNext, onPrev }: {
  language: Language;
  setLanguage: (lang: Language) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <StepWrapper onNext={onNext} onPrev={onPrev}>
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-sage-100 flex items-center justify-center">
          <Globe className="w-9 h-9 text-sage-600" />
        </div>
        <h2 className="section-title text-2xl mb-1">Choose your language</h2>
        <p className="text-lg text-ink-500">Pick the language you are most comfortable with.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code as Language)}
            className={`card-base p-5 text-center transition ${
              language === lang.code ? 'border-2 border-honey-400 bg-honey-50' : 'hover:shadow-lift'
            }`}
          >
            <p className="font-display font-extrabold text-ink-800 text-xl">{lang.nativeLabel}</p>
            <p className="text-ink-400 text-sm mt-1">{lang.label}</p>
            {language === lang.code && (
              <div className="w-7 h-7 mx-auto mt-2 rounded-full bg-honey-500 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </StepWrapper>
  );
}

function StepAddPeople({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
  return (
    <StepWrapper onNext={onNext} onPrev={onPrev} nextLabel="Skip for now">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-coral-100 flex items-center justify-center">
          <Users className="w-9 h-9 text-coral-600" />
        </div>
        <h2 className="section-title text-2xl mb-1">Add important people</h2>
        <p className="text-lg text-ink-500">
          Would you like to add family members or close friends? This helps you recognize the people in your life.
        </p>
      </div>
      <div className="card-base p-5 bg-cream-50 border-2 border-cream-200">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-cream-200 flex items-center justify-center shrink-0">
            <UserPlus className="w-7 h-7 text-ink-500" />
          </div>
          <div>
            <p className="font-bold text-ink-700 text-lg">Ask a family member to help</p>
            <p className="text-ink-400 text-base mt-0.5">
              You can ask someone you trust to add people for you later.
            </p>
          </div>
        </div>
      </div>
      <p className="text-center text-ink-400 text-base mt-4">
        You can skip this and add people later.
      </p>
    </StepWrapper>
  );
}

function StepAddReminders({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
  return (
    <StepWrapper onNext={onNext} onPrev={onPrev} nextLabel="Skip for now">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-honey-100 flex items-center justify-center">
          <Bell className="w-9 h-9 text-honey-600" />
        </div>
        <h2 className="section-title text-2xl mb-1">Add daily reminders</h2>
        <p className="text-lg text-ink-500">
          Reminders help you remember important things like medicine, meals, and calling family.
        </p>
      </div>
      <div className="space-y-3">
        {[
          { icon: Bell, label: 'Take Medicine', time: '9:00 AM', color: 'bg-honey-100 text-honey-600' },
          { icon: Calendar, label: 'Breakfast', time: '9:30 AM', color: 'bg-sage-100 text-sage-600' },
          { icon: Bell, label: 'Call Family', time: '11:00 AM', color: 'bg-coral-100 text-coral-600' },
        ].map((item, i) => (
          <div key={i} className="card-base p-4 flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl ${item.color} flex items-center justify-center shrink-0`}>
              <item.icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-ink-700 text-lg">{item.label}</p>
              <p className="text-ink-400 text-sm">{item.time}</p>
            </div>
            <div className="w-7 h-7 rounded-full bg-sage-100 flex items-center justify-center">
              <Check className="w-4 h-4 text-sage-600" />
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-ink-400 text-base mt-4">
        We added some common reminders for you. You can change them later.
      </p>
    </StepWrapper>
  );
}

function StepFeatures({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
  const features = [
    { icon: Calendar, label: 'My Day', desc: 'See what you need to do today.', color: 'bg-honey-100 text-honey-600' },
    { icon: Brain, label: 'Play a Game', desc: 'Enjoy simple, fun activities.', color: 'bg-sage-100 text-sage-600' },
    { icon: Images, label: 'My Memories', desc: 'Look at special photos and moments.', color: 'bg-coral-100 text-coral-600' },
    { icon: Users, label: 'My People', desc: 'See the important people in your life.', color: 'bg-cream-200 text-ink-600' },
    { icon: LifeBuoy, label: 'I Need Help', desc: 'Get help quickly anytime.', color: 'bg-coral-100 text-coral-600' },
  ];

  return (
    <StepWrapper onNext={onNext} onPrev={onPrev} nextLabel="Finish Setup">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-sage-100 flex items-center justify-center">
          <Sparkles className="w-9 h-9 text-sage-600" />
        </div>
        <h2 className="section-title text-2xl mb-1">What you can do here</h2>
        <p className="text-lg text-ink-500">Here are the main things your companion can help you with.</p>
      </div>
      <div className="space-y-3">
        {features.map((f, i) => (
          <div key={i} className="card-base p-4 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center shrink-0`}>
              <f.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-ink-700 text-lg leading-tight">{f.label}</p>
              <p className="text-ink-400 text-sm">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </StepWrapper>
  );
}

function StepFinish({ patientName, onFinish, onPrev }: { patientName: string; onFinish: () => void; onPrev: () => void }) {
  return (
    <StepWrapper onNext={onFinish} onPrev={onPrev} nextLabel="Start Using Haven">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-sage-100 flex items-center justify-center">
          <Check className="w-10 h-10 text-sage-600" />
        </div>
        <h1 className="section-title text-3xl mb-3">You're all set, {patientName}! ⭐</h1>
        <p className="text-xl text-ink-600 leading-relaxed">
          Your companion is ready. Let's go to your day.
        </p>
        <p className="text-lg text-ink-400 mt-3">
          Remember: you can always ask for help by pressing the "I Need Help" button.
        </p>
      </div>
    </StepWrapper>
  );
}
