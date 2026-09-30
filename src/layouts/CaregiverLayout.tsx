import type { ReactNode } from 'react';

export function CaregiverLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cream-100">
      {children}
    </div>
  );
}
