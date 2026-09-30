import type { ReactNode } from 'react';
import { TopBar } from '@/components/TopBar';
import { BottomNav } from '@/components/BottomNav';
import { ReminderOverlay } from '@/pages/ReminderOverlay';
import { FamilyHelpAccess } from '@/components/FamilyHelpAccess';

export function PatientLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cream-50">
      <TopBar />
      <main className="px-4 sm:px-6 py-6 pb-28 max-w-6xl mx-auto">
        {children}
      </main>
      <BottomNav />
      <FamilyHelpAccess />
      <ReminderOverlay />
    </div>
  );
}
