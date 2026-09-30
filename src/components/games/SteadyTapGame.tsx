import { useState, useEffect } from 'react';
import { playTapSound, playSuccessChime } from '@/utils/audio';
import { Activity, Trophy, Sparkles, RotateCcw } from 'lucide-react';

export function SteadyTapGame({ onFinish }: { onFinish: () => void }) {
  const [tapCount, setTapCount] = useState(0);
  const [pulsePhase, setPulsePhase] = useState(0); // 0 to 1
  const [lastFeedback, setLastFeedback] = useState<string>('Follow the rhythm and tap gently');
  const [completed, setCompleted] = useState(false);

  const TARGET_TAPS = 6;

  // Gentle rhythm pulse loop: expands and contracts every 2.4 seconds
  useEffect(() => {
    let animFrame: number;
    const start = performance.now();

    const loop = (now: number) => {
      const elapsed = (now - start) % 2400;
      // Normalizing to 0 -> 1 -> 0
      const phase = Math.sin((elapsed / 2400) * Math.PI);
      setPulsePhase(phase);
      animFrame = requestAnimationFrame(loop);
    };

    animFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  const handleTap = () => {
    playTapSound();
    // Check if tapped near the peak of the pulse (phase > 0.6)
    if (pulsePhase > 0.55) {
      setLastFeedback('✨ Perfect rhythm! Very steady.');
    } else {
      setLastFeedback('🌱 Good gentle tap! Keep the tempo.');
    }

    const nextCount = tapCount + 1;
    setTapCount(nextCount);

    if (nextCount >= TARGET_TAPS) {
      playSuccessChime();
      setCompleted(true);
    }
  };

  const restart = () => {
    setTapCount(0);
    setLastFeedback('Follow the rhythm and tap gently');
    setCompleted(false);
  };

  return (
    <div className="text-center max-w-lg mx-auto">
      <div className="mb-4">
        <h3 className="text-2xl font-display font-extrabold text-ink-800">Steady Rhythm Tap</h3>
        <p className="text-ink-500 text-lg">Tap the circle gently as it pulses.</p>
      </div>

      {completed ? (
        <div className="card-base p-8 bg-amber-50 border-2 border-amber-300 animate-scaleIn">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-amber-200 flex items-center justify-center text-amber-800">
            <Trophy className="w-10 h-10" />
          </div>
          <h4 className="text-2xl font-extrabold text-amber-900 mb-2">Steady & Calm! ⭐</h4>
          <p className="text-lg text-amber-800 mb-6">
            Great job! You tapped with a calm and steady rhythm.
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
        <div className="card-base p-8 border-2 border-amber-200 flex flex-col items-center">
          <p className="text-lg font-bold text-amber-800 mb-6">{lastFeedback}</p>

          {/* Interactive Pulsing Rhythm Disk */}
          <div className="relative w-64 h-64 flex items-center justify-center mb-6">
            {/* Target guide ring */}
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-amber-300 pointer-events-none" />

            {/* Glowing animated disk with large click target */}
            <button
              onClick={handleTap}
              style={{
                transform: `scale(${0.7 + pulsePhase * 0.45})`,
                transition: 'transform 0.05s ease-out',
              }}
              className="w-48 h-48 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 shadow-xl border-4 border-white flex flex-col items-center justify-center text-amber-950 font-display font-black text-2xl active:scale-90 select-none cursor-pointer focus:outline-none"
            >
              <Activity className="w-10 h-10 mb-1 text-amber-800" />
              <span>TAP HERE</span>
            </button>
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-3 mb-3">
            {Array.from({ length: TARGET_TAPS }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full transition-all ${
                  i < tapCount ? 'bg-amber-500 scale-110 shadow-sm' : 'bg-cream-300'
                }`}
              />
            ))}
          </div>

          <p className="text-sm font-semibold text-ink-400">
            {tapCount} of {TARGET_TAPS} steady taps completed
          </p>
        </div>
      )}
    </div>
  );
}
