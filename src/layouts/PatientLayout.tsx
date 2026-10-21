import type { ReactNode } from 'react';
import { TopBar } from '@/components/TopBar';
import { BottomNav } from '@/components/BottomNav';
import { ReminderOverlay } from '@/pages/ReminderOverlay';
import { FamilyHelpAccess } from '@/components/FamilyHelpAccess';
import { ScrollProgressBar } from '@/components/ScrollProgressBar';
import { BackToTop } from '@/components/BackToTop';
import { FloatingContactButton } from '@/components/FloatingContactButton';

export function PatientLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cream-50 dark:bg-ink-950">
      {/* Scroll progress bar – Item 8 */}
      <ScrollProgressBar />
      <TopBar />
      <main id="main-content" className="px-4 sm:px-6 py-6 pb-28 max-w-6xl mx-auto">
        {children}
      </main>
      <BottomNav />
      <FamilyHelpAccess />
      <ReminderOverlay />
      {/* Back to top – Item 4 */}
      <BackToTop />
      {/* Floating contact button – Item 20 */}
      <FloatingContactButton />
    </div>
  );
}

