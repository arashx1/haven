import { AppProvider, useApp } from '@/context/AppContext';
import { PatientLayout } from '@/layouts/PatientLayout';
import { CaregiverLayout } from '@/layouts/CaregiverLayout';
import { MyDayPage } from '@/pages/MyDayPage';
import { PlayPage } from '@/pages/PlayPage';
import { MemoriesPage } from '@/pages/MemoriesPage';
import { MemoryDetailPage } from '@/pages/MemoryDetailPage';
import { PeoplePage } from '@/pages/PeoplePage';
import { PersonDetailPage } from '@/pages/PersonDetailPage';
import { HelpPage } from '@/pages/HelpPage';
import { SignUpPage } from '@/pages/SignUpPage';
import { LoginPage } from '@/pages/LoginPage';
import { OnboardingPage } from '@/pages/OnboardingPage';
import { CaregiverDashboardPage } from '@/pages/CaregiverDashboardPage';
import { DemoPage } from '@/pages/DemoPage';
import { AuthGateModal } from '@/components/AuthGateModal';
import { CookieBanner } from '@/components/CookieBanner';

function AppRouter() {
  const { route, authLoading } = useApp();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-honey-200 border-t-honey-500 animate-spin" />
      </div>
    );
  }

  const renderPage = () => {
    if (route === 'demo') return <DemoPage />;
    if (route === 'signup') return <SignUpPage />;
    if (route === 'login') return <LoginPage />;
    if (route === 'onboarding') return <OnboardingPage />;

    if (route === 'caregiver-dashboard') {
      return (
        <CaregiverLayout>
          <CaregiverDashboardPage />
        </CaregiverLayout>
      );
    }

    return (
      <PatientLayout>
        {route === 'my-day' && <MyDayPage />}
        {route === 'play' && <PlayPage />}
        {route === 'memories' && <MemoriesPage />}
        {route === 'memory-detail' && <MemoryDetailPage />}
        {route === 'people' && <PeoplePage />}
        {route === 'person-detail' && <PersonDetailPage />}
        {route === 'help' && <HelpPage />}
      </PatientLayout>
    );
  };

  return (
    <>
      {renderPage()}
      {/* Auth gate modal renders globally above all pages */}
      <AuthGateModal />
      {/* Cookie & data storage compliance banner */}
      <CookieBanner />
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}

export default App;
