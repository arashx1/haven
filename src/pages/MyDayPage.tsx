import {useState,useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useApp} from '@/context/AppContext';
import {useReminders} from '@/hooks/useReminders';
import {isDue} from '@/utils/reminders';
import {Check,Clock,Pill,Utensils,Phone,Calendar,Heart,Plus} from 'lucide-react';
import {LoadingState,ErrorState} from '@/components/UI';
const icons={medicine:Pill,meal:Utensils,appointment:Calendar,call:Phone,activity:Heart,task:Check};
export function MyDayPage(){
  const {patientName,timezone,navigate}=useApp();
  const {t,i18n}=useTranslation();
  const {reminders,loading,error,busy,completeReminder,snoozeReminder,refresh,lastSynced}=useReminders();
  const [notice,setNotice]=useState(''),[now,setNow]=useState(new Date());
  useEffect(()=>{const timer=setInterval(()=>setNow(new Date()),15000);return ()=>clearInterval(timer);},[]);
  const pending=reminders.filter(r=>!r.done);
  const next=pending.find(r=>isDue(r,now,timezone)) || pending.find(r=>!r.snoozedUntil || new Date(r.snoozedUntil)<=now);
  const done=reminders.filter(r=>r.done).length;
  const hour=Number(new Intl.DateTimeFormat('en-GB',{hour:'2-digit',hourCycle:'h23',timeZone:timezone}).format(now));
  const Icon=next?icons[next.type]:Check;
  const complete=async()=>{if(next && await completeReminder(next.id))setNotice('Saved. This task is complete for today.');};
  const snooze=async()=>{if(next && await snoozeReminder(next.id))setNotice('Saved. We will show this reminder again in 15 minutes while Haven is open.');};
  return <div className="max-w-3xl mx-auto space-y-6">
    <div><p className="eyebrow">{now.toLocaleDateString(i18n.language,{weekday:'long',month:'long',day:'numeric',timeZone:timezone})}</p><h1 className="section-title text-3xl sm:text-4xl mt-2">{hour<12?t('greetingMorning'):hour<17?t('greetingAfternoon'):t('greetingEvening')}{patientName?', '+patientName.split(' ')[0]:''}.</h1><p className="text-ink-600 text-lg mt-3">One thing at a time. Your day is right here.</p></div>
    {loading && <LoadingState message="Loading your day…"/>}{error && <ErrorState message={error} onRetry={refresh}/>}
    {notice && <p role="status" className="notice">{notice}</p>}
    {!loading && !error && <>
      {next?<section className="card-base p-6 sm:p-8 border-2 border-honey-200">
        <div className="flex items-center gap-4"><span className="p-4 rounded-2xl bg-honey-100 text-honey-700"><Icon className="w-8 h-8"/></span><div><p className="eyebrow">{isDue(next,now,timezone)?'Ready for your attention':'Coming up'}</p><p className="text-3xl font-bold mt-1">{next.time}</p></div></div>
        <h2 className="section-title text-2xl mt-6">{next.title}</h2><p className="text-lg text-ink-600 mt-2 mb-6">{next.description}</p>
        <div className="flex flex-col sm:flex-row gap-3"><button disabled={busy} className="btn-success flex-1" onClick={complete}><Check/>{busy?'Saving…':next.type==='medicine'?'I took it':'Mark complete'}</button><button disabled={busy} className="btn-secondary flex-1" onClick={snooze}><Clock/>In 15 minutes</button></div>
      </section>:<section className="card-base p-8 text-center"><Check className="mx-auto w-12 h-12 text-sage-600"/><h2 className="section-title text-2xl mt-3">{!reminders.length?'A fresh start.':pending.length?'Your reminders are snoozed.':'Your tasks are complete.'}</h2><p className="text-ink-600 mt-3">{!reminders.length?'Add your first daily reminder, or ask a trusted helper to set it up.':pending.length?'They will return when their snooze ends.':'Take a moment to enjoy your day.'}</p>{!reminders.length && <button onClick={()=>navigate('caregiver-dashboard')} className="btn-primary mt-5"><Plus/>Set up my day</button>}</section>}
      {!!reminders.length && <section><div className="flex justify-between items-center mb-3"><h2 className="section-title text-xl">Today’s routine</h2><span className="text-ink-600">{done} of {reminders.length} complete</span></div><div className="space-y-3">{reminders.map(r=><div key={r.id} className="card-base p-4 flex items-center gap-4">{r.done?<Check className="text-sage-600 shrink-0"/>:<Clock className="text-honey-700 shrink-0"/>}<div><p className="text-lg font-bold">{r.title}</p><p className="text-ink-600">{r.time}{r.done?' · Completed':r.snoozedUntil?' · Snoozed until '+new Date(r.snoozedUntil).toLocaleTimeString(i18n.language,{hour:'2-digit',minute:'2-digit',timeZone:timezone}):''}</p></div></div>)}</div></section>}
    </>}
    <p className="text-sm text-ink-500">Schedule: {timezone}. Reminders appear while Haven is open; background alerts are not enabled.{lastSynced?' Last synced '+lastSynced.toLocaleTimeString(i18n.language,{hour:'2-digit',minute:'2-digit'})+'.':''}</p>
  </div>;
}
