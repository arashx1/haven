import type {ReactNode} from 'react';
import {TopBar} from '@/components/TopBar';
import {BottomNav} from '@/components/BottomNav';
export function PatientLayout({children}:{children:ReactNode}){
  return <div className="min-h-screen bg-cream-50 dark:bg-ink-900"><TopBar/><main id="main-content" tabIndex={-1} className="px-4 sm:px-6 py-8 pb-28 max-w-6xl mx-auto">{children}</main><BottomNav/></div>;
}
