import {useState} from 'react';
import {useApp} from '@/context/AppContext';
import {CONDITIONS} from '@/data/catalog';
import {errorMessage} from '@/lib/supabaseClient';
export function OnboardingPage() {
  const {patientName,careCondition,timezone,updateProfile,navigate} = useApp();
  const [name,setName] = useState(patientName), [condition,setCondition] = useState(careCondition), [zone,setZone] = useState(timezone);
  const [busy,setBusy] = useState(false), [error,setError] = useState('');
  const save = async (e:React.FormEvent) => {
    e.preventDefault(); setBusy(true); setError('');
    try { await updateProfile({full_name:name.trim(),care_condition:condition,timezone:zone}); navigate('caregiver-dashboard'); }
    catch(e) {setError(errorMessage(e));} finally {setBusy(false);}
  };
  return <main className="max-w-lg mx-auto p-6"><form onSubmit={save} className="card-base p-6 space-y-5"><p className="eyebrow">Welcome to Haven</p><h1 className="section-title text-3xl">Your day, your way.</h1>
    <p>Start with your preferences. Next, add your actual reminders, family contacts, and memories in Care settings.</p>
    <label className="field-label">Your name<input required maxLength={100} className="field-input" value={name} onChange={e=>setName(e.target.value)} /></label>
    <label className="field-label">Care focus<select className="field-input" value={condition} onChange={e=>setCondition(e.target.value as typeof condition)}>{CONDITIONS.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select></label>
    <label className="field-label">Time zone<input className="field-input" required value={zone} onChange={e=>setZone(e.target.value)} placeholder="Asia/Kolkata" /></label>
    <p className="text-sm text-ink-600">Daily reminders use this time zone, including when a helper is elsewhere.</p>
    {error && <p role="alert" className="error-message">{error}</p>}<button disabled={busy} className="btn-primary w-full">{busy ? 'Saving…':'Save and set up my care'}</button>
  </form></main>;
}
