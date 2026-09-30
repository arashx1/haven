import { useState } from 'react';
import { playTapSound, playSuccessChime } from '@/utils/audio';
import { Trophy, Sparkles, RotateCcw } from 'lucide-react';

interface SortItem {
  name: string;
  emoji: string;
  category: 'Bathroom' | 'Kitchen' | 'Bedroom';
}

const ITEMS: SortItem[] = [
  { name: 'Toothbrush', emoji: '🪥', category: 'Bathroom' },
  { name: 'Frying Pan', emoji: '🍳', category: 'Kitchen' },
  { name: 'Soft Pillow', emoji: '🛏️', category: 'Bedroom' },
  { name: 'Soap Bar', emoji: '🧼', category: 'Bathroom' },
  { name: 'Tea Kettle', emoji: '🫖', category: 'Kitchen' },
];

const ROOMS: { name: 'Bathroom' | 'Kitchen' | 'Bedroom'; label: string; icon: string; color: string }[] = [
  { name: 'Bathroom', label: 'Bathroom', icon: '🛁', color: 'bg-cyan-100 hover:bg-cyan-200 border-cyan-300 text-cyan-900' },
  { name: 'Kitchen', label: 'Kitchen', icon: '🍳', color: 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-900' },
  { name: 'Bedroom', label: 'Bedroom', icon: '🛏️', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300 text-indigo-900' },
];

export function ItemSortingGame({ onFinish }: { onFinish: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);

  const currentItem = ITEMS[currentIdx];

  const handleChooseRoom = (room: 'Bathroom' | 'Kitchen' | 'Bedroom') => {
    playTapSound();
    setSelectedRoom(room);
    const correct = room === currentItem.category;
    setIsCorrect(correct);

    if (correct) {
      playSuccessChime();
      setTimeout(() => {
        if (currentIdx + 1 < ITEMS.length) {
          setCurrentIdx((prev) => prev + 1);
          setSelectedRoom(null);
          setIsCorrect(null);
        } else {
          setCompleted(true);
        }
      }, 1200);
    } else {
      setTimeout(() => {
        setSelectedRoom(null);
        setIsCorrect(null);
      }, 1200);
    }
  };

  const restart = () => {
    setCurrentIdx(0);
    setSelectedRoom(null);
    setIsCorrect(null);
    setCompleted(false);
  };

  return (
    <div className="text-center max-w-lg mx-auto">
      <div className="mb-4">
        <h3 className="text-2xl font-display font-extrabold text-ink-800">Daily Item Sorting</h3>
        <p className="text-ink-500 text-lg">Pick the right room for each item.</p>
      </div>

      {completed ? (
        <div className="card-base p-8 bg-coral-50 border-2 border-coral-300 animate-scaleIn">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-coral-200 flex items-center justify-center text-coral-800">
            <Trophy className="w-10 h-10" />
          </div>
          <h4 className="text-2xl font-extrabold text-coral-900 mb-2">Everything in Its Place! ⭐</h4>
          <p className="text-lg text-coral-800 mb-6">
            Great job! You sorted every item into the right room.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={restart} className="btn-secondary">
              <RotateCcw className="w-5 h-5" />
              Sort Again
            </button>
            <button onClick={onFinish} className="btn-success">
              <Sparkles className="w-5 h-5" />
              Done
            </button>
          </div>
        </div>
      ) : (
        <div className="card-base p-6 border-2 border-coral-200 animate-fadeIn">
          {/* Item to Sort */}
          <div className="py-6 px-4 bg-gradient-to-b from-coral-50 to-cream-100 rounded-3xl border-2 border-coral-200 mb-6">
            <div className="text-7xl mb-2 animate-bounce">{currentItem.emoji}</div>
            <p className="text-2xl font-display font-extrabold text-ink-800">{currentItem.name}</p>
            <p className="text-ink-500 text-lg font-medium mt-1">Which room does this belong in?</p>
          </div>

          {/* Room Selection Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ROOMS.map((room) => {
              const isChosen = selectedRoom === room.name;
              let style = `${room.color} border-2`;
              if (isChosen) {
                style = isCorrect
                  ? 'bg-sage-100 text-sage-900 border-2 border-sage-500 scale-105'
                  : 'bg-coral-100 text-coral-900 border-2 border-coral-400';
              }

              return (
                <button
                  key={room.name}
                  onClick={() => handleChooseRoom(room.name)}
                  disabled={selectedRoom !== null}
                  className={`py-4 px-3 rounded-2xl font-extrabold text-lg flex flex-col items-center gap-1.5 transition-all shadow-sm active:scale-95 ${style}`}
                >
                  <span className="text-3xl">{room.icon}</span>
                  <span>{room.label}</span>
                </button>
              );
            })}
          </div>

          {selectedRoom && !isCorrect && (
            <p className="mt-4 text-coral-600 font-bold animate-fadeIn">
              Almost! Try another room. 🌸
            </p>
          )}

          <p className="mt-5 text-sm font-semibold text-ink-400">
            Item {currentIdx + 1} of {ITEMS.length}
          </p>
        </div>
      )}
    </div>
  );
}
