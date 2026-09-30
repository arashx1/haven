import { useState } from 'react';
import { playTapSound, playSuccessChime } from '@/utils/audio';
import { Volume2, Trophy, Sparkles, RotateCcw } from 'lucide-react';

interface WordCard {
  emoji: string;
  word: string;
  phonetic: string;
  sentence: string;
  options: string[];
}

const ITEMS: WordCard[] = [
  {
    emoji: '🍵',
    word: 'Tea',
    phonetic: 'Tee / Chai',
    sentence: 'A soothing cup of morning tea.',
    options: ['Tea', 'Clock', 'Shoe'],
  },
  {
    emoji: '📖',
    word: 'Book',
    phonetic: 'Buuk / Kitaab',
    sentence: 'A good book to read quietly.',
    options: ['Chair', 'Book', 'Apple'],
  },
  {
    emoji: '💧',
    word: 'Water',
    phonetic: 'Wah-ter / Paani',
    sentence: 'Fresh cool water to stay healthy.',
    options: ['Car', 'Window', 'Water'],
  },
  {
    emoji: '🍎',
    word: 'Apple',
    phonetic: 'Ap-pul / Seb',
    sentence: 'A sweet and crisp fruit.',
    options: ['Apple', 'Pencil', 'Hat'],
  },
];

export function WordConnectGame({ onFinish }: { onFinish: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);

  const current = ITEMS[currentIdx];

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85; // Calmer, slower speech for aphasia practice
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelect = (option: string) => {
    playTapSound();
    setSelected(option);
    const correct = option === current.word;
    setIsCorrect(correct);

    if (correct) {
      playSuccessChime();
      speakWord(current.word);
      setTimeout(() => {
        if (currentIdx + 1 < ITEMS.length) {
          setCurrentIdx((prev) => prev + 1);
          setSelected(null);
          setIsCorrect(null);
        } else {
          setCompleted(true);
        }
      }, 1500);
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
        <h3 className="text-2xl font-display font-extrabold text-ink-800">Word & Object Connect</h3>
        <p className="text-ink-500 text-lg">Tap the word that matches the picture.</p>
      </div>

      {completed ? (
        <div className="card-base p-8 bg-sky-50 border-2 border-sky-300 animate-scaleIn">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-sky-200 flex items-center justify-center text-sky-800">
            <Trophy className="w-10 h-10" />
          </div>
          <h4 className="text-2xl font-extrabold text-sky-900 mb-2">Clear & Strong Words! ⭐</h4>
          <p className="text-lg text-sky-800 mb-6">
            You matched all the words today! Great job.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={restart} className="btn-secondary">
              <RotateCcw className="w-5 h-5" />
              Practice Again
            </button>
            <button onClick={onFinish} className="btn-success">
              <Sparkles className="w-5 h-5" />
              Done
            </button>
          </div>
        </div>
      ) : (
        <div className="card-base p-6 border-2 border-sky-200 animate-fadeIn">
          {/* Visual Display */}
          <div className="w-32 h-32 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-sky-100 to-indigo-100 flex items-center justify-center text-6xl shadow-inner border-2 border-sky-200">
            {current.emoji}
          </div>

          <div className="flex justify-center mb-3">
            <button
              onClick={() => speakWord(current.word)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-sky-100 hover:bg-sky-200 text-sky-800 rounded-full font-bold text-base transition-colors shadow-sm"
            >
              <Volume2 className="w-5 h-5" />
              <span>Hear word ({current.word})</span>
            </button>
          </div>

          <p className="text-xl font-bold text-ink-700 mb-6">{current.sentence}</p>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {current.options.map((opt) => {
              const isSelectedOpt = selected === opt;
              let btnClass = 'bg-cream-100 hover:bg-sky-50 text-ink-800 border-2 border-cream-300';
              if (isSelectedOpt) {
                btnClass = isCorrect
                  ? 'bg-sage-100 text-sage-900 border-2 border-sage-500 scale-105'
                  : 'bg-coral-100 text-coral-900 border-2 border-coral-400';
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  disabled={selected !== null}
                  className={`py-4 px-4 rounded-2xl font-extrabold text-2xl transition-all shadow-sm active:scale-95 ${btnClass}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {selected && !isCorrect && (
            <p className="mt-4 text-coral-600 font-bold animate-fadeIn">
              Take a gentle breath and try another word. You can do it! 🌿
            </p>
          )}

          <p className="mt-5 text-sm font-semibold text-ink-400">
            Word {currentIdx + 1} of {ITEMS.length}
          </p>
        </div>
      )}
    </div>
  );
}
