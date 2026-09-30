import { useState, useEffect } from 'react';
import { playSuccessChime } from '@/utils/audio';
import { Trophy, Sparkles, RotateCcw, Wind } from 'lucide-react';

export function BreathingGame({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<'Inhale gently...' | 'Hold softly...' | 'Exhale slowly...' | 'Rest...'>('Inhale gently...');
  const [cycleCount, setCycleCount] = useState(0);
  const [scale, setScale] = useState(0.7);
  const [completed, setCompleted] = useState(false);

  const TARGET_CYCLES = 3;

  useEffect(() => {
    let isCancelled = false;
    if (completed) return;

    // 12-second cycle: 4s inhale, 2s hold, 4s exhale, 2s rest
    const runCycle = async () => {
      for (let c = 0; c < TARGET_CYCLES; c++) {
        if (isCancelled) return;
        setPhase('Inhale gently...');
        setScale(1.25);
        await new Promise((r) => setTimeout(r, 4000));
        if (isCancelled) return;

        setPhase('Hold softly...');
        await new Promise((r) => setTimeout(r, 2000));
        if (isCancelled) return;

        setPhase('Exhale slowly...');
        setScale(0.7);
        await new Promise((r) => setTimeout(r, 4000));
        if (isCancelled) return;

        setPhase('Rest...');
        await new Promise((r) => setTimeout(r, 2000));
        if (isCancelled) return;

        setCycleCount(c + 1);
      }

      if (!isCancelled) {
        playSuccessChime();
        setCompleted(true);
      }
    };

    runCycle();

    return () => {
      isCancelled = true;
    };
  }, [completed]);

  const restart = () => {
    setCycleCount(0);
    setScale(0.7);
    setPhase('Inhale gently...');
    setCompleted(false);
  };

  return (
    <div className="text-center max-w-lg mx-auto select-none">
      <div className="mb-4">
        <h3 className="text-2xl font-display font-extrabold text-ink-800">Serene Breathing Circle</h3>
        <p className="text-ink-500 text-lg">Follow the gentle circle for calm, slow breaths.</p>
      </div>

      {completed ? (
        <div className="card-base p-8 bg-rose-50 border-2 border-rose-300 animate-scaleIn">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-rose-200 flex items-center justify-center text-rose-800">
            <Trophy className="w-10 h-10" />
          </div>
          <h4 className="text-2xl font-extrabold text-rose-900 mb-2">Peaceful Breathing! 🌿</h4>
          <p className="text-lg text-rose-800 mb-6">
            You completed 3 mindful breaths. Feel calm, relaxed, and refreshed.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={restart} className="btn-secondary">
              <RotateCcw className="w-5 h-5" />
              Breathe Again
            </button>
            <button onClick={onFinish} className="btn-success">
              <Sparkles className="w-5 h-5" />
              Done
            </button>
          </div>
        </div>
      ) : (
        <div className="card-base p-8 border-2 border-rose-200 flex flex-col items-center">
          <div className="h-10 flex items-center justify-center mb-6">
            <p className="text-2xl font-display font-extrabold text-rose-900 animate-fadeIn">
              {phase}
            </p>
          </div>

          {/* Interactive animated breathing orb */}
          <div className="relative w-64 h-64 flex items-center justify-center my-4">
            <div
              style={{
                transform: `scale(${scale})`,
                transition: 'transform 4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              className="w-48 h-48 rounded-full bg-gradient-to-tr from-rose-400 via-rose-300 to-amber-200 shadow-2xl flex items-center justify-center border-4 border-white/60"
            >
              <div className="w-32 h-32 rounded-full bg-white/40 backdrop-blur-xs flex items-center justify-center">
                <Wind className="w-12 h-12 text-rose-800/80 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2">
            {Array.from({ length: TARGET_CYCLES }).map((_, i) => (
              <span
                key={i}
                className={`w-3.5 h-3.5 rounded-full transition-colors duration-300 ${
                  i < cycleCount ? 'bg-rose-500 scale-110' : 'bg-rose-200'
                }`}
              />
            ))}
            <span className="text-sm font-bold text-ink-500 ml-2">
              Breath {Math.min(TARGET_CYCLES, cycleCount + 1)} of {TARGET_CYCLES}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
