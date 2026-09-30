import { useState } from 'react';
import { playTapSound, playSuccessChime } from '@/utils/audio';
import { Volume2, Trophy, Sparkles, RotateCcw } from 'lucide-react';

interface SentenceItem {
  prompt: string;
  options: { label: string; emoji: string }[];
  correct: string;
  completedText: string;
}

const SENTENCES: SentenceItem[] = [
  {
    prompt: 'Good morning! Today the weather is warm and _____',
    options: [
      { label: 'Sunny ☀️', emoji: '☀️' },
      { label: 'Spoon 🥄', emoji: '🥄' },
    ],
    correct: 'Sunny ☀️',
    completedText: 'Good morning! Today the weather is warm and sunny.',
  },
  {
    prompt: 'Before going for a walk, I put on my comfy _____',
    options: [
      { label: 'Clock ⏰', emoji: '⏰' },
      { label: 'Shoes 👟', emoji: '👟' },
    ],
    correct: 'Shoes 👟',
    completedText: 'Before going for a walk, I put on my comfy shoes.',
  },
  {
    prompt: 'In the garden, I see a beautiful blooming _____',
    options: [
      { label: 'Flower 🌸', emoji: '🌸' },
      { label: 'Pillow 🛏️', emoji: '🛏️' },
    ],
    correct: 'Flower 🌸',
    completedText: 'In the garden, I see a beautiful blooming flower.',
  },
];

export function SentenceBuilderGame({ onFinish }: { onFinish: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);

  const current = SENTENCES[currentIdx];

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelect = (optionLabel: string) => {
    playTapSound();
    setSelected(optionLabel);
    const correct = optionLabel === current.correct;
    setIsCorrect(correct);

    if (correct) {
      playSuccessChime();
      speak(current.completedText);
      setTimeout(() => {
        if (currentIdx + 1 < SENTENCES.length) {
          setCurrentIdx((prev) => prev + 1);
          setSelected(null);
          setIsCorrect(null);
        } else {
          setCompleted(true);
        }
      }, 1600);
    } else {
      setTimeout(() => {
        setSelected(null);
        setIsCorrect(null);
      }, 1200);
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
        <h3 className="text-2xl font-display font-extrabold text-ink-800">Sentence Companion</h3>
        <p className="text-ink-500 text-lg">Pick the word that completes the sentence.</p>
      </div>

      {completed ? (
        <div className="card-base p-8 bg-indigo-50 border-2 border-indigo-300 animate-scaleIn">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-800">
            <Trophy className="w-10 h-10" />
          </div>
          <h4 className="text-2xl font-extrabold text-indigo-900 mb-2">Beautiful Sentences! ⭐</h4>
          <p className="text-lg text-indigo-800 mb-6">
            Well done! You completed all the sentences.
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
        <div className="card-base p-6 border-2 border-indigo-200">
          <div className="p-6 bg-indigo-50/60 rounded-2xl border border-indigo-100 mb-6 text-left">
            <p className="text-2xl font-bold text-ink-800 leading-relaxed">
              {current.prompt}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {current.options.map((opt) => {
              const isSelected = selected === opt.label;
              let style = 'bg-cream-100 hover:bg-cream-200 text-ink-800 border-2 border-cream-300';
              if (isSelected) {
                style = isCorrect
                  ? 'bg-sage-100 text-sage-900 border-2 border-sage-500 scale-105'
                  : 'bg-coral-100 text-coral-900 border-2 border-coral-400';
              }

              return (
                <button
                  key={opt.label}
                  onClick={() => handleSelect(opt.label)}
                  disabled={selected !== null}
                  className={`py-5 px-6 rounded-2xl font-extrabold text-2xl transition-all shadow-sm ${style}`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {selected && isCorrect && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sage-700 font-bold">
              <Volume2 className="w-5 h-5 animate-pulse" />
              <span>"{current.completedText}"</span>
            </div>
          )}

          <p className="mt-5 text-sm font-semibold text-ink-400">
            Sentence {currentIdx + 1} of {SENTENCES.length}
          </p>
        </div>
      )}
    </div>
  );
}
