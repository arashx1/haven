import { useState } from 'react';
import { playTapSound, playSuccessChime } from '@/utils/audio';
import { Trophy, Sparkles, RotateCcw, Check } from 'lucide-react';

interface Step {
  id: number;
  text: string;
  emoji: string;
}

const STEPS_DATA: Step[] = [
  { id: 1, text: 'Wake up & stretch gently', emoji: '☀️' },
  { id: 2, text: 'Wash hands & brush teeth', emoji: '🧼' },
  { id: 3, text: 'Enjoy a warm, healthy breakfast', emoji: '🥣' },
];

export function RoutineOrderGame({ onFinish }: { onFinish: () => void }) {
  const [selectedSteps, setSelectedSteps] = useState<number[]>([]);
  const [availableSteps, setAvailableSteps] = useState<Step[]>(() =>
    [...STEPS_DATA].sort(() => Math.random() - 0.5)
  );
  const [completed, setCompleted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePickStep = (step: Step) => {
    playTapSound();
    const nextExpected = selectedSteps.length + 1;
    if (step.id === nextExpected) {
      const newSelected = [...selectedSteps, step.id];
      setSelectedSteps(newSelected);
      setAvailableSteps((prev) => prev.filter((s) => s.id !== step.id));
      setErrorMsg(null);

      if (newSelected.length === STEPS_DATA.length) {
        playSuccessChime();
        setCompleted(true);
      }
    } else {
      setErrorMsg('Try another step first!');
      setTimeout(() => setErrorMsg(null), 1800);
    }
  };

  const restart = () => {
    setSelectedSteps([]);
    setAvailableSteps([...STEPS_DATA].sort(() => Math.random() - 0.5));
    setErrorMsg(null);
    setCompleted(false);
  };

  return (
    <div className="text-center max-w-lg mx-auto">
      <div className="mb-4">
        <h3 className="text-2xl font-display font-extrabold text-ink-800">Morning Routine Order</h3>
        <p className="text-ink-500 text-lg">Tap what you do 1st, 2nd, and 3rd.</p>
      </div>

      {completed ? (
        <div className="card-base p-8 bg-violet-50 border-2 border-violet-300 animate-scaleIn">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-violet-200 flex items-center justify-center text-violet-800">
            <Trophy className="w-10 h-10" />
          </div>
          <h4 className="text-2xl font-extrabold text-violet-900 mb-2">Perfect Morning Flow! ⭐</h4>
          <p className="text-lg text-violet-800 mb-6">
            Wonderful! Your morning steps are all in order.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={restart} className="btn-secondary">
              <RotateCcw className="w-5 h-5" />
              Try Again
            </button>
            <button onClick={onFinish} className="btn-success">
              <Sparkles className="w-5 h-5" />
              Done
            </button>
          </div>
        </div>
      ) : (
        <div className="card-base p-6 border-2 border-violet-200">
          {/* Completed Order Slots */}
          <div className="space-y-3 mb-6">
            {STEPS_DATA.map((step, idx) => {
              const isFilled = selectedSteps.includes(step.id);
              return (
                <div
                  key={step.id}
                  className={`p-4 rounded-2xl flex items-center gap-4 border-2 transition-all ${
                    isFilled
                      ? 'bg-sage-100 border-sage-300 text-sage-900'
                      : 'bg-cream-100/60 border-dashed border-cream-300 text-ink-300'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-lg ${
                      isFilled ? 'bg-sage-500 text-white' : 'bg-cream-300 text-ink-400'
                    }`}
                  >
                    {isFilled ? <Check className="w-5 h-5 stroke-[3]" /> : idx + 1}
                  </div>
                  <span className="font-bold text-lg">
                    {isFilled ? `${step.emoji} ${step.text}` : `Step ${idx + 1}`}
                  </span>
                </div>
              );
            })}
          </div>

          {errorMsg && (
            <p className="text-coral-600 font-bold mb-4 animate-fadeIn">{errorMsg}</p>
          )}

          {/* Choices to Tap */}
          {availableSteps.length > 0 && (
            <div>
              <p className="text-ink-600 font-bold mb-3 text-left">Tap the next step:</p>
              <div className="space-y-3">
                {availableSteps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => handlePickStep(step)}
                    className="w-full p-4 rounded-2xl bg-white hover:bg-violet-50 border-2 border-violet-200 hover:border-violet-400 text-ink-800 font-bold text-lg flex items-center gap-3 text-left transition-all shadow-sm active:scale-98"
                  >
                    <span className="text-2xl">{step.emoji}</span>
                    <span>{step.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
