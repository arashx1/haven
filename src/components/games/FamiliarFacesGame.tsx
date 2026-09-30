import { useState } from 'react';
import { playTapSound, playSuccessChime } from '@/utils/audio';
import { Heart, Trophy, Sparkles, RotateCcw } from 'lucide-react';
import { PersonAvatar } from '@/components/Illustration';

interface Question {
  personKey: string;
  name: string;
  relation: string;
  prompt: string;
  options: string[];
  correct: string;
}

const QUESTIONS: Question[] = [
  {
    personKey: 'priya',
    name: 'Priya',
    relation: 'Your Daughter',
    prompt: 'This is your loving daughter who calls you every morning. What is her name?',
    options: ['Priya (Daughter)', 'Sunita (Neighbor)'],
    correct: 'Priya (Daughter)',
  },
  {
    personKey: 'rohan',
    name: 'Rohan',
    relation: 'Your Son',
    prompt: 'This is your wonderful son who loves bringing you fresh fruit. What is his name?',
    options: ['Dr. Sharma', 'Rohan (Son)'],
    correct: 'Rohan (Son)',
  },
  {
    personKey: 'meena',
    name: 'Meena',
    relation: 'Your Caregiver',
    prompt: 'This is Meena who is by your side every day with care and patience. What is her role?',
    options: ['Meena (Caregiver)', 'Bank Manager'],
    correct: 'Meena (Caregiver)',
  },
];

export function FamiliarFacesGame({ onFinish }: { onFinish: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);

  const currentQ = QUESTIONS[currentIdx];

  const handleSelect = (option: string) => {
    playTapSound();
    setSelected(option);
    const correct = option === currentQ.correct;
    setIsCorrect(correct);

    if (correct) {
      playSuccessChime();
      setTimeout(() => {
        if (currentIdx + 1 < QUESTIONS.length) {
          setCurrentIdx((prev) => prev + 1);
          setSelected(null);
          setIsCorrect(null);
        } else {
          setCompleted(true);
        }
      }, 1200);
    } else {
      setTimeout(() => {
        setSelected(null);
        setIsCorrect(null);
      }, 1400);
    }
  };

  const restart = () => {
    setCurrentIdx(0);
    setSelected(null);
    setIsCorrect(null);
    setCompleted(false);
  };

  return (
    <div className="text-center max-w-lg mx-auto">
      <div className="mb-4">
        <h3 className="text-2xl font-display font-extrabold text-ink-800">Familiar Faces & Loved Ones</h3>
        <p className="text-ink-500 text-lg">Recognize the people who love and support you.</p>
      </div>

      {completed ? (
        <div className="card-base p-8 bg-sage-50 border-2 border-sage-300 animate-scaleIn">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-sage-200 flex items-center justify-center text-sage-700">
            <Trophy className="w-10 h-10" />
          </div>
          <h4 className="text-2xl font-extrabold text-sage-900 mb-2">Wonderful Connection! ❤️</h4>
          <p className="text-lg text-sage-700 mb-6">
            You recognized all your loved ones. They are always in your heart and thinking of you.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={restart} className="btn-secondary">
              <RotateCcw className="w-5 h-5" />
              Play Again
            </button>
            <button onClick={onFinish} className="btn-success">
              <Sparkles className="w-5 h-5" />
              Done
            </button>
          </div>
        </div>
      ) : (
        <div className="card-base p-6 border-2 border-cream-300 animate-fadeIn">
          <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden shadow-lg border-4 border-white bg-cream-100 flex items-center justify-center">
            <PersonAvatar personKey={currentQ.personKey} className="w-full h-full" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-coral-100 text-coral-700 font-bold rounded-full text-sm mb-3">
            <Heart className="w-4 h-4 fill-coral-500" />
            <span>{currentQ.relation}</span>
          </div>

          <p className="text-xl font-bold text-ink-700 mb-6">{currentQ.prompt}</p>

          <div className="flex flex-col gap-3">
            {currentQ.options.map((opt) => {
              const isSelectedOpt = selected === opt;
              let btnClass = 'bg-cream-100 hover:bg-cream-200 text-ink-800 border-2 border-cream-300';
              if (isSelectedOpt) {
                btnClass = isCorrect
                  ? 'bg-sage-100 text-sage-900 border-2 border-sage-500 scale-102'
                  : 'bg-coral-100 text-coral-900 border-2 border-coral-400';
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  disabled={selected !== null}
                  className={`py-4 px-6 rounded-2xl font-extrabold text-xl transition-all shadow-sm active:scale-98 ${btnClass}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {selected && !isCorrect && (
            <p className="mt-4 text-coral-600 font-bold animate-fadeIn">
              Let's try again gently! Take your time. ❤️
            </p>
          )}

          <p className="mt-5 text-sm font-semibold text-ink-400">
            Step {currentIdx + 1} of {QUESTIONS.length}
          </p>
        </div>
      )}
    </div>
  );
}
