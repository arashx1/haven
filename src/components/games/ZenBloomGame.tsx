import { useState } from 'react';
import { playTapSound, playSuccessChime } from '@/utils/audio';
import { Sparkles, Trophy, RotateCcw, Heart } from 'lucide-react';

interface Petal {
  id: number;
  label: string;
  colorClass: string;
  affirmation: string;
  bloomed: boolean;
}

const PETALS_DATA: Omit<Petal, 'bloomed'>[] = [
  { id: 0, label: 'Rose', colorClass: 'bg-rose-400 text-rose-950', affirmation: 'I am safe, loved, and at peace.' },
  { id: 1, label: 'Honey', colorClass: 'bg-amber-400 text-amber-950', affirmation: 'Today brings warmth and joy.' },
  { id: 2, label: 'Emerald', colorClass: 'bg-emerald-400 text-emerald-950', affirmation: 'Every breath renews my vitality.' },
  { id: 3, label: 'Sky', colorClass: 'bg-sky-400 text-sky-950', affirmation: 'My mind is clear and calm.' },
  { id: 4, label: 'Lavender', colorClass: 'bg-violet-400 text-violet-950', affirmation: 'Serenity surrounds me and my family.' },
];

export function ZenBloomGame({ onFinish }: { onFinish: () => void }) {
  const [petals, setPetals] = useState<Petal[]>(() =>
    PETALS_DATA.map((p) => ({ ...p, bloomed: false }))
  );
  const [activeAffirmation, setActiveAffirmation] = useState(
    'Tap any petal to bloom your garden and discover peace.'
  );
  const [completed, setCompleted] = useState(false);

  const handleBloomPetal = (id: number) => {
    playTapSound();
    const petal = petals.find((p) => p.id === id);
    if (!petal) return;

    setActiveAffirmation(`🌸 "${petal.affirmation}"`);

    const updated = petals.map((p) => (p.id === id ? { ...p, bloomed: true } : p));
    setPetals(updated);

    if (updated.every((p) => p.bloomed)) {
      playSuccessChime();
      setTimeout(() => setCompleted(true), 1200);
    }
  };

  const restart = () => {
    setPetals(PETALS_DATA.map((p) => ({ ...p, bloomed: false })));
    setActiveAffirmation('Tap any petal to bloom your garden and discover peace.');
    setCompleted(false);
  };

  return (
    <div className="text-center max-w-lg mx-auto select-none">
      <div className="mb-4">
        <h3 className="text-2xl font-display font-extrabold text-ink-800">Zen Flower Bloom</h3>
        <p className="text-ink-500 text-lg">Tap each petal to watch the flower bloom.</p>
      </div>

      {completed ? (
        <div className="card-base p-8 bg-emerald-50 border-2 border-emerald-300 animate-scaleIn">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-800">
            <Trophy className="w-10 h-10" />
          </div>
          <h4 className="text-2xl font-extrabold text-emerald-900 mb-2">A Garden in Full Bloom! 🌸</h4>
          <p className="text-lg text-emerald-800 mb-6">
            All flowers are blooming! Have a peaceful and happy day.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={restart} className="btn-secondary">
              <RotateCcw className="w-5 h-5" />
              Bloom Again
            </button>
            <button onClick={onFinish} className="btn-success">
              <Sparkles className="w-5 h-5" />
              Done
            </button>
          </div>
        </div>
      ) : (
        <div className="card-base p-6 border-2 border-emerald-200">
          {/* Affirmation banner */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 mb-6 min-h-[70px] flex items-center justify-center">
            <p className="text-lg font-bold text-emerald-900 italic animate-fadeIn">
              {activeAffirmation}
            </p>
          </div>

          {/* Interactive Flower Center & Petals */}
          <div className="relative w-72 h-72 mx-auto my-4 flex items-center justify-center">
            {/* Center Core */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-300 to-amber-100 shadow-lg border-4 border-white flex flex-col items-center justify-center z-10">
              <Heart className="w-8 h-8 text-rose-500 fill-rose-400" />
              <span className="text-xs font-black text-amber-900 uppercase tracking-wider">Peace</span>
            </div>

            {/* Circular Petals */}
            {petals.map((petal, i) => {
              const angle = (i * (360 / petals.length) * Math.PI) / 180;
              const radius = 95; // px from center
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <button
                  key={petal.id}
                  onClick={() => handleBloomPetal(petal.id)}
                  style={{
                    transform: `translate(${x}px, ${y}px) scale(${petal.bloomed ? 1.15 : 0.95})`,
                  }}
                  className={`absolute w-20 h-20 rounded-full border-4 border-white shadow-md transition-all duration-300 flex items-center justify-center font-bold text-sm cursor-pointer active:scale-125 ${
                    petal.bloomed
                      ? `${petal.colorClass} shadow-lg ring-4 ring-emerald-200`
                      : 'bg-cream-200 hover:bg-cream-300 text-ink-500'
                  }`}
                >
                  {petal.bloomed ? '🌸' : '🌱 Tap'}
                </button>
              );
            })}
          </div>

          <p className="text-sm font-semibold text-ink-400 mt-4">
            {petals.filter((p) => p.bloomed).length} of {petals.length} petals bloomed
          </p>
        </div>
      )}
    </div>
  );
}
