import {useState,useEffect} from 'react';
import {useApp} from '@/context/AppContext';
import {LANGUAGES,type Language,type TextScale} from '@/data/catalog';
import {Settings,Sun,Moon,X} from 'lucide-react';
import {useDialog} from '@/hooks/useDialog';
function Preferences({onClose}:{onClose:()=>void}) {
  const {language,setLanguage,textScale,setTextScale,navigate,session,signOut} = useApp();
  const [dark,setDark] = useState(document.documentElement.classList.contains('dark'));
  const ref = useDialog(onClose);
  const toggle = () => {const next=!dark;setDark(next);document.documentElement.classList.toggle('dark',next);try {localStorage.setItem('haven_dark_mode',String(next));}catch{/* optional */}};
  return <div className="modal-backdrop"><div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="preferences-title" className="modal-card">
    <div className="flex justify-between items-center"><h2 id="preferences-title" className="section-title text-2xl">Make yourself comfortable</h2><button className="icon-button" aria-label="Close preferences" onClick={onClose}><X /></button></div>
    <label className="field-label mt-5">Language<select value={language} onChange={e=>setLanguage(e.target.value as Language)} className="field-input">{LANGUAGES.map(l=><option value={l.code} key={l.code}>{l.nativeLabel}</option>)}</select></label>
    <label className="field-label mt-5">Text size<select value={textScale} onChange={e=>setTextScale(Number(e.target.value) as TextScale)} className="field-input"><option value={1}>Small</option><option value={2}>Standard</option><option value={3}>Large</option><option value={4}>Extra large</option></select></label>
    <button className="btn-secondary w-full mt-5" onClick={toggle}>{dark ? <Sun />:<Moon />}{dark?'Use light appearance':'Use dark appearance'}</button>
    {session && <><button onClick={()=>{onClose();navigate('caregiver-dashboard');}} className="btn-primary w-full mt-5">Care & family settings</button><button onClick={()=>{onClose();void signOut();}} className="btn-secondary w-full mt-3">Sign out</button></>}
  </div></div>;
}
export function TopBar() {
  const {navigate,session} = useApp(); const [open,setOpen] = useState(false);
  useEffect(()=>{try{document.documentElement.classList.toggle('dark',localStorage.getItem('haven_dark_mode')==='true');}catch{/* optional */}},[]);
  return <><a href="#main-content" onClick={e=>{e.preventDefault();document.getElementById('main-content')?.focus();}} className="skip-link">Skip to content</a>
    <header className="sticky top-0 z-30 bg-cream-50/95 dark:bg-ink-900 border-b border-cream-200 backdrop-blur-md">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center gap-4">
      <button onClick={()=>navigate(session?'my-day':'login')} className="flex items-center gap-3 text-left" aria-label="Haven home"><span className="brand-mark">h</span><span><span className="block text-2xl font-display font-extrabold text-ink-800">Haven</span><span className="text-sm text-ink-500">A little help, every day</span></span></button>
      <button className="icon-button" onClick={()=>setOpen(true)} aria-label="Open preferences"><Settings /></button>
    </div></header>{open && <Preferences onClose={()=>setOpen(false)} />}</>;
}
