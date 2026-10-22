import {lazy,Suspense} from 'react';
import {AppProvider,useApp} from '@/context/AppContext';
import {PatientLayout} from '@/layouts/PatientLayout';
import {MyDayPage} from '@/pages/MyDayPage';
import {LoginPage,ResetPasswordPage} from '@/pages/LoginPage';
import {SignUpPage} from '@/pages/SignUpPage';
import {isSupabaseConfigured} from '@/lib/supabaseClient';
import {ErrorBoundary} from '@/components/ErrorBoundary';
const PlayPage=lazy(()=>import('@/pages/PlayPage').then(m=>({default:m.PlayPage})));
const MemoriesPage=lazy(()=>import('@/pages/MemoriesPage').then(m=>({default:m.MemoriesPage})));
const MemoryDetailPage=lazy(()=>import('@/pages/MemoryDetailPage').then(m=>({default:m.MemoryDetailPage})));
const PeoplePage=lazy(()=>import('@/pages/PeoplePage').then(m=>({default:m.PeoplePage})));
const PersonDetailPage=lazy(()=>import('@/pages/PersonDetailPage').then(m=>({default:m.PersonDetailPage})));
const HelpPage=lazy(()=>import('@/pages/HelpPage').then(m=>({default:m.HelpPage})));
const CaregiverDashboardPage=lazy(()=>import('@/pages/CaregiverDashboardPage').then(m=>({default:m.CaregiverDashboardPage})));
const OnboardingPage=lazy(()=>import('@/pages/OnboardingPage').then(m=>({default:m.OnboardingPage})));
const PaywallModal=lazy(()=>import('@/components/PaywallModal').then(m=>({default:m.PaywallModal})));
function Loading(){return <div role="status" className="p-12 text-center text-ink-600">Opening Haven…</div>;}
function AppRouter(){
  const {route,session,authLoading,patientId,profileError,refreshProfiles,paywallOpen,closePaywall}=useApp();
  if(!isSupabaseConfigured) return <main className="max-w-lg p-8 mx-auto"><h1 className="section-title text-2xl">Haven is not connected yet.</h1><p className="mt-4">Account services are unavailable. Please contact the app administrator.</p></main>;
  if(authLoading) return <Loading/>;
  if(!session) return route==='signup'?<SignUpPage/>:<LoginPage/>;
  if(new URLSearchParams(location.search).get('recovery')==='1') return <ResetPasswordPage/>;
  let page;
  switch(route){
    case 'caregiver-dashboard': page=<CaregiverDashboardPage/>;break;
    case 'onboarding':page=<OnboardingPage/>;break;
    case 'play':page=<PlayPage/>;break;
    case 'memories':page=<MemoriesPage/>;break;
    case 'memory-detail':page=<MemoryDetailPage/>;break;
    case 'people':page=<PeoplePage/>;break;
    case 'person-detail':page=<PersonDetailPage/>;break;
    case 'help':page=<HelpPage/>;break;
    default:page=<MyDayPage/>;
  }
  return <Suspense fallback={<Loading/>}>
    {profileError && <div role="alert" className="error-message m-4">{profileError}<button className="underline ml-3" onClick={()=>void refreshProfiles()}>Retry</button></div>}
    <div key={session.user.id+':'+patientId}>{route==='caregiver-dashboard'||route==='onboarding'?page:<PatientLayout>{page}</PatientLayout>}</div>
    {paywallOpen && <PaywallModal onClose={closePaywall}/>}
  </Suspense>;
}
export default function App(){return <ErrorBoundary><AppProvider><AppRouter/></AppProvider></ErrorBoundary>;}
