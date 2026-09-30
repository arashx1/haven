import { useState } from 'react';
import { playTapSound, playSuccessChime } from '@/utils/audio';
import { Trophy, Sparkles, RotateCcw } from 'lucide-react';

interface Bubble {
  id: number;
  x: number; // percentage 10% - 80%
  y: number; // percentage 0% - 90%
  color: string;
  size: number;
  popped: boolean;
}

const BUBBLE_COLORS = [
  'from-teal-300 to-teal-500 border-teal-200',
  'from-cyan-300 to-cyan-500 border-cyan-200',
  'from-sky-300 to-sky-500 border-sky-200',
  'from-emerald-300 to-emerald-500 border-emerald-200',
];

function generateBubbles(): Bubble[] {
  return Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    x: 15 + (i % 3) * 30 + Math.random() * 8,
    y: 20 + Math.floor(i / 3) * 38 + Math.random() * 6,
    color: BUBBLE_COLORS[i % BUBBLE_COLORS.length],
    size: 72 + Math.random() * 20,
    popped: false,
  }));
}

export function BubbleCatchGame({ onFinish }: { onFinish: () => void }) {
  const [bubbles, setBubbles] = useState<Bubble[]>(generateBubbles);
  const [poppedCount, setPoppedCount] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handlePop = (id: number) => {
    playTapSound();
    setBubbles((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );
    const nextCount = poppedCount + 1;
    setPoppedCount(nextCount);

    if (nextCount >= bubbles.length) {
      playSuccessChime();
      setTimeout(() => setCompleted(true), 400);
    }
  };

  const restart = () => {
    setBubbles(generateBubbles());
    setPoppedCount(0);
    setCompleted(false);
  };

  return (
    <div className="text-center max-w-lg mx-auto select-none">
      <div className="mb-4">
        <h3 className="text-2xl font-display font-extrabold text-ink-800">Peaceful Bubble Catch</h3>
        <p className="text-ink-500 text-lg">Tap each soft floating bubble at your own gentle pace.</p>
      </div>

      {completed ? (
        <div className="card-base p-8 bg-teal-50 border-2 border-teal-300 animate-scaleIn">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-teal-200 flex items-center justify-center text-teal-800">
            <Trophy className="w-10 h-10" />
          </div>
          <h4 className="text-2xl font-extrabold text-teal-900 mb-2">Delightful Gentle Touch! ⭐</h4>
          <p className="text-lg text-teal-800 mb-6">
            You popped all the gentle bubbles! Well done.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={restart} className="btn-secondary">
              <RotateCcw className="w-5 h-5" />
              Catch More
            </button>
            <button onClick={onFinish} className="btn-success">
              <Sparkles className="w-5 h-5" />
              Done
            </button>
          </div>
        </div>
      ) : (
        <div className="card-base p-4 border-2 border-teal-200 relative h-96 overflow-hidden bg-gradient-to-b from-teal-50/50 to-cyan-50/50 rounded-3xl">
          {bubbles.map((bubble) => {
            if (bubble.popped) return null;
            return (
              <button
                key={bubble.id}
                onClick={() => handlePop(bubble.id)}
                style={{
                  left: `${bubble.x}%`,
                  top: `${bubble.y}%`,
                  width: `${bubble.size}px`,
                  height: `${bubble.size}px`,
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr ${bubble.color} shadow-lg border-2 opacity-90 hover:opacity-100 active:scale-125 transition-transform flex items-center justify-center cursor-pointer animate-pulse`}
              >
                <span className="text-2xl">✨</span>
              </button>
            );
          })}

          <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
            <span className="bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold text-teal-900 border border-teal-200">
              {bubbles.length - poppedCount} gentle bubbles remaining
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
