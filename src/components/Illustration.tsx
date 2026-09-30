import { type ReactNode } from 'react';

const PERSON_EMOJIS: Record<string, string> = {
  priya: '👩',
  rohan: '👨',
  aarav: '👦',
  meena: '👩‍⚕️',
};

const palettes: Record<string, { bg: string; fg: string; accent: string }> = {
  'family-wedding': { bg: 'from-honey-200 to-honey-400', fg: 'text-honey-800', accent: 'text-honey-600' },
  kaziranga: { bg: 'from-sage-200 to-sage-400', fg: 'text-sage-800', accent: 'text-sage-600' },
  bihu: { bg: 'from-coral-200 to-coral-400', fg: 'text-coral-800', accent: 'text-coral-600' },
  grandchild: { bg: 'from-cream-200 to-honey-200', fg: 'text-honey-800', accent: 'text-honey-600' },
  priya: { bg: 'from-honey-200 to-coral-200', fg: 'text-honey-800', accent: 'text-coral-600' },
  rohan: { bg: 'from-sage-200 to-cream-200', fg: 'text-sage-800', accent: 'text-sage-600' },
  aarav: { bg: 'from-cream-200 to-honey-200', fg: 'text-honey-800', accent: 'text-honey-600' },
  meena: { bg: 'from-sage-200 to-sage-300', fg: 'text-sage-800', accent: 'text-sage-600' },
};

export function Illustration({
  id,
  label,
  className = '',
  rounded = 'rounded-3xl',
}: {
  id: string;
  label?: string;
  className?: string;
  rounded?: string;
}) {
  const palette = palettes[id] ?? { bg: 'from-cream-200 to-cream-300', fg: 'text-ink-700', accent: 'text-ink-500' };

  return (
    <div className={`${rounded} bg-gradient-to-br ${palette.bg} flex items-center justify-center overflow-hidden ${className}`}>
      <div className="text-center px-4">
        <div className={`text-5xl mb-2 ${palette.accent}`}>🌿</div>
        {label && <p className={`font-display font-bold text-lg ${palette.fg}`}>{label}</p>}
      </div>
    </div>
  );
}

export function PersonAvatar({ personKey, className = '' }: { personKey: string; className?: string }) {
  const palette = palettes[personKey] ?? { bg: 'from-cream-200 to-cream-300', fg: 'text-ink-700', accent: 'text-ink-500' };
  const emoji = PERSON_EMOJIS[personKey] ?? '🧑';

  return (
    <div className={`bg-gradient-to-br ${palette.bg} flex items-center justify-center overflow-hidden ${className}`}>
      <span className="text-6xl select-none">{emoji}</span>
    </div>
  );
}

export function GameThumbnail({ icon, gradient, className = '' }: { icon: ReactNode; gradient: string; className?: string }) {
  return (
    <div className={`rounded-3xl bg-gradient-to-br ${gradient} flex items-center justify-center ${className}`}>
      <div className="text-white">{icon}</div>
    </div>
  );
}
