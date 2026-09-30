import { useState } from 'react';
import { playTapSound, playSuccessChime } from '@/utils/audio';
import { RotateCcw, Trophy, Sparkles } from 'lucide-react';

interface CardItem {
  id: number;
  emoji: string;
  name: string;
  matched: boolean;
}

const BASE_CARDS = [
  { emoji: '🌸', name: 'Flower' },
  { emoji: '☀️', name: 'Sun' },
  { emoji: '🍎', name: 'Apple' },
];

function generateDeck(): CardItem[] {
  const items = [...BASE_CARDS, ...BASE_CARDS];
  const shuffled = items
    .map((item, index) => ({ id: index, ...item, matched: false }))
    .sort(() => Math.random() - 0.5);
  return shuffled;
}

export function MemoryMatchGame({ onFinish }: { onFinish: () => void }) {
  const [cards, setCards] = useState<CardItem[]>(generateDeck);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [isWon, setIsWon] = useState(false);

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || cards[index].matched || flipped.includes(index)) return;

    playTapSound();
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first].emoji === cards[second].emoji) {
        // Matched!
        setTimeout(() => {
          setCards((prev) => {
            const next = [...prev];
            next[first].matched = true;
            next[second].matched = true;
            if (next.every((c) => c.matched)) {
              setIsWon(true);
              playSuccessChime();
            }
            return next;
          });
          setFlipped([]);
        }, 500);
      } else {
        // Not matched
        setTimeout(() => {
          setFlipped([]);
        }, 1100);
      }
    }
  };

  const restart = () => {
    setCards(generateDeck());
    setFlipped([]);
    setIsWon(false);
  };

  return (
    <div className="text-center max-w-lg mx-auto">
      <div className="mb-4">
        <h3 className="text-2xl font-display font-extrabold text-ink-800">Picture Matching</h3>
        <p className="text-ink-500 text-lg">Tap two cards to find gentle matching pairs.</p>
      </div>

      {isWon ? (
        <div className="card-base p-8 bg-sage-50 border-2 border-sage-300 animate-scaleIn">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-sage-200 flex items-center justify-center text-sage-700">
            <Trophy className="w-10 h-10" />
          </div>
          <h4 className="text-2xl font-extrabold text-sage-900 mb-2">Beautiful Job! ⭐</h4>
          <p className="text-lg text-sage-700 mb-6">You found all matching pairs! Your memory is shining today.</p>
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
        <div className="grid grid-cols-3 gap-4 my-6">
          {cards.map((card, idx) => {
            const isCardFlipped = flipped.includes(idx) || card.matched;
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(idx)}
                className={`h-28 sm:h-36 rounded-2xl flex flex-col items-center justify-center text-4xl sm:text-5xl transition-all duration-300 shadow-md transform active:scale-95 border-2 ${
                  isCardFlipped
                    ? card.matched
                      ? 'bg-sage-100 border-sage-400 text-sage-800 scale-100'
                      : 'bg-honey-100 border-honey-400 text-honey-800 scale-105'
                    : 'bg-cream-100 border-cream-300 hover:border-honey-300'
                }`}
              >
                {isCardFlipped ? (
                  <span className="animate-scaleIn">{card.emoji}</span>
                ) : (
                  <span className="text-2xl text-ink-300 font-bold">?</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {!isWon && (
        <button onClick={restart} className="text-ink-400 hover:text-ink-600 font-bold inline-flex items-center gap-2 mt-2">
          <RotateCcw className="w-4 h-4" />
          Shuffle Cards
        </button>
      )}
    </div>
  );
}
