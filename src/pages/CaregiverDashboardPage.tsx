import {useEffect,useState} from 'react';
import {useApp} from '@/context/AppContext';
import {useReminders} from '@/hooks/useReminders';
import {useMemories} from '@/hooks/useMemories';
import {usePeople} from '@/hooks/usePeople';
import {supabase,errorMessage} from '@/lib/supabaseClient';
import {TopBar} from '@/components/TopBar';
import {CONDITIONS,type Reminder} from '@/data/catalog';
import {Check,Trash2,Plus,ArrowLeft} from 'lucide-react';
import {CareCircle} from '@/components/CareCircle';
import {ContactModal} from '@/components/ContactModal';
type Tab='reminders'|'memories'|'people'|'family'|'activity';
export function CaregiverDashboardPage(){
  const {patientName,patientId,profiles,selectPatient,session,navigate,openPaywall,timezone,careCondition,updateProfile}=useApp();
  const reminders=useReminders(),memories=useMemories(),people=usePeople();
  const [tab,setTab]=useState<Tab>('reminders'),[adding,setAdding]=useState(false),[formError,setFormError]=useState(''),[saving,setSaving]=useState(false),[support,setSupport]=useState(false);
  const [settingsNotice,setSettingsNotice]=useState('');
  const [events,setEvents]=useState<{id:string;action:string;created_at:string;actor_name:string;subject:string}[]>([]),[activityError,setActivityError]=useState('');
  const error=tab==='reminders'?reminders.error:tab==='memories'?memories.error:tab==='people'?people.error:null;
  const busy=saving||reminders.busy||memories.busy||people.busy;
  useEffect(()=>{
    if(tab!=='activity')return;
    let active=true;
    supabase.from('care_activity').select('id,action,created_at,actor_name,subject').eq('user_id',patientId).order('created_at',{ascending:false}).limit(100).then(({data,error})=>{
      if(active){setActivityError(error?.message||'');setEvents(data||[]);}
    });
    return ()=>{active=false;};
  },[tab,patientId]);
  const photo=async(form:FormData)=>{
    const file=form.get('photo');
    if(!(file instanceof File)||!file.size)return '';
    if(file.size>5*1024*1024||!['image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('Choose a JPG, PNG, or WebP image under 5 MB.');
    return new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(new Error('Could not read this photo.'));reader.readAsDataURL(file);});
  };
  const submit=async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();setSaving(true);setFormError('');
    const form=new FormData(e.currentTarget),get=(key:string)=>String(form.get(key)||'').trim();
    try{
      let ok=false;
      if(tab==='reminders')ok=await reminders.addReminder({title:get('title'),time:get('time'),description:get('description'),type:get('type') as Reminder['type'],icon:get('type')});
      if(tab==='memories')ok=await memories.addMemory({title:get('title'),year:get('year'),description:get('description'),caption:get('title'),detail:get('description'),image:await photo(form)});
      if(tab==='people')ok=await people.addPerson({name:get('name'),relationship:get('relationship'),phone:get('phone'),info:get('info'),image:await photo(form)});
      if(ok)setAdding(false);
    }catch(e){setFormError(errorMessage(e));}finally{setSaving(false);}
  };
  const remove=async(id:string)=>{
    if(!window.confirm('Delete this item? This cannot be undone.'))return;
    if(tab==='reminders')await reminders.deleteReminder(id);
    if(tab==='memories')await memories.deleteMemory(id);
    if(tab==='people')await people.deletePerson(id);
  };
  const saveSettings=async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();setSaving(true);setSettingsNotice('');setFormError('');
    const form=new FormData(e.currentTarget);
    try {await updateProfile({full_name:String(form.get('name')).trim(),care_condition:String(form.get('condition')) as typeof careCondition,timezone:String(form.get('timezone')).trim()});setSettingsNotice('Care preferences saved.');}
    catch(e){setFormError(errorMessage(e));}finally{setSaving(false);}
  };
  const items=tab==='memories'?memories.memories.map(m=>({id:m.id,title:m.title,subtitle:m.description,image:m.image})):people.people.map(p=>({id:p.id,title:p.name,subtitle:p.relationship,image:p.image}));
  return <div className="min-h-screen bg-cream-50"><TopBar/><main id="main-content" tabIndex={-1} className="max-w-5xl mx-auto px-4 py-8">
    <button className="text-honey-700 font-bold flex gap-2 mb-6" onClick={()=>navigate('my-day')}><ArrowLeft/>Back to My Day</button>
    <div className="flex flex-wrap gap-4 justify-between items-end"><div><p className="eyebrow">Together, with care</p><h1 className="section-title text-3xl mt-2">Care & family</h1><p className="text-ink-600 mt-2">Helping {patientName||'you'} organize everyday life.</p></div>
    <label className="field-label">Care profile<select value={patientId} onChange={e=>selectPatient(e.target.value)} className="field-input">{profiles.map(p=><option key={p.id} value={p.id}>{p.full_name||'My profile'}{p.id===session?.user.id?' (you)':''}</option>)}</select></label></div>
    <div className="grid grid-cols-3 gap-3 my-6">{[['Tasks today',reminders.reminders.length],['Memories',memories.memories.length],['People',people.people.length]].map(([label,value])=><div className="card-base p-4" key={label}><p className="text-2xl font-bold">{value}</p><p className="text-ink-600 text-sm">{label}</p></div>)}</div>
    <nav aria-label="Care sections" className="flex flex-wrap gap-2 mb-6">{(['reminders','memories','people','family','activity'] as Tab[]).map(name=><button key={name} aria-current={tab===name?'page':undefined} onClick={()=>{setTab(name);setAdding(false);setFormError('');}} className={tab===name?'care-tab active':'care-tab'}>{name[0].toUpperCase()+name.slice(1)}</button>)}</nav>
    {(error||formError) && <p role="alert" className="error-message mb-4">{formError||error}</p>}
    {['reminders','memories','people'].includes(tab) && <>
      <div className="flex justify-between items-center mb-4"><h2 className="section-title text-xl">{tab==='reminders'?'Daily reminders':tab==='memories'?'Your memories':'Important people'}</h2><button disabled={busy} onClick={()=>setAdding(!adding)} className="btn-primary py-3 px-4 text-base"><Plus/>{adding?'Close form':'Add '+(tab==='reminders'?'reminder':tab==='memories'?'memory':'person')}</button></div>
      {adding && <form onSubmit={submit} className="card-base p-6 mb-5 space-y-4">
        <label className="field-label">{tab==='people'?'Name':'Title'}<input name={tab==='people'?'name':'title'} required maxLength={150} className="field-input"/></label>
        {tab==='reminders' && <><div className="grid sm:grid-cols-2 gap-4"><label className="field-label">Daily time ({timezone})<input type="time" name="time" required className="field-input"/></label><label className="field-label">Task type<select name="type" className="field-input">{['medicine','meal','appointment','activity','call','task'].map(type=><option value={type} key={type}>{type}</option>)}</select></label></div><p className="text-sm text-ink-600">Repeats every day. For a one-time appointment, remove this reminder afterward. In-app reminders require Haven to be open.</p></>}
        {tab==='memories' && <label className="field-label">Year or date<input name="year" maxLength={50} className="field-input"/></label>}
        {tab==='people' && <><label className="field-label">Relationship<input name="relationship" maxLength={100} className="field-input" placeholder="Daughter, friend, caregiver…"/></label><label className="field-label">Phone number<input type="tel" name="phone" pattern="[+0-9() .-]{7,24}" className="field-input" placeholder="+91 …"/></label></>}
        <label className="field-label">{tab==='people'?'About this person':tab==='memories'?'The story behind this memory':'A helpful note'}<textarea name={tab==='people'?'info':'description'} maxLength={5000} className="field-input" rows={3}/></label>
        {tab!=='reminders' && <label className="field-label">Photo (optional)<input type="file" name="photo" accept="image/jpeg,image/png,image/webp" className="field-input"/><span className="font-normal text-sm">Private JPG, PNG, or WebP, up to 5 MB.</span></label>}
        <button disabled={busy} className="btn-success w-full">{busy?'Saving…':'Save '+(tab==='people'?'person':tab==='memories'?'memory':'reminder')}</button>
      </form>}
      {(tab==='reminders'?reminders.loading:tab==='memories'?memories.loading:people.loading)?<p role="status">Loading…</p>:tab==='reminders'?<div className="space-y-3">{!reminders.reminders.length && <div className="empty-card">No reminders yet. Add the first routine above.</div>}{reminders.reminders.map(r=><div className="card-base p-4 flex gap-4 items-center" key={r.id}><div className="flex-1"><p className="text-lg font-bold">{r.title}</p><p className="text-ink-600">{r.time} · {r.done?'Completed today':r.description}</p></div>{!r.done && <button disabled={busy} className="icon-button text-sage-700" aria-label={'Complete '+r.title} onClick={()=>void reminders.completeReminder(r.id)}><Check/></button>}<button disabled={busy} onClick={()=>void remove(r.id)} aria-label={'Delete '+r.title} className="icon-button text-coral-700"><Trash2/></button></div>)}</div>:<div className="grid sm:grid-cols-2 gap-4">{!items.length && <div className="empty-card">Nothing added yet. Start with someone or something familiar.</div>}{items.map(item=><article className="card-base overflow-hidden" key={item.id}>{item.image && <img src={item.image} alt={item.title} className="w-full aspect-[4/3] object-cover" loading="lazy"/>}<div className="p-5 flex gap-3 items-start"><div className="flex-1"><h3 className="text-xl font-bold">{item.title}</h3><p className="text-ink-600 whitespace-pre-wrap">{item.subtitle}</p></div><button className="icon-button text-coral-700" disabled={busy} aria-label={'Delete '+item.title} onClick={()=>void remove(item.id)}><Trash2/></button></div></article>)}</div>}
    </>}
    {tab==='family' && <><CareCircle/>{patientId===session?.user.id && <form onSubmit={saveSettings} className="card-base p-6 mt-6 space-y-4"><h2 className="section-title text-xl">Your care preferences</h2><label className="field-label">Name<input name="name" defaultValue={patientName} required maxLength={100} className="field-input"/></label><label className="field-label">Care focus<select name="condition" defaultValue={careCondition} className="field-input">{CONDITIONS.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select></label><label className="field-label">Time zone<input required name="timezone" defaultValue={timezone} className="field-input"/></label>{settingsNotice&&<p role="status" className="notice">{settingsNotice}</p>}<button disabled={busy} className="btn-primary">{busy?'Saving…':'Save preferences'}</button></form>}</>}
    {tab==='activity' && <section className="card-base p-6"><h2 className="section-title text-xl mb-4">Recent care activity</h2>{activityError && <p role="alert" className="error-message">{activityError}</p>}{!activityError&&!events.length&&<p>No recorded activity yet.</p>}<ol className="space-y-4">{events.map(event=><li key={event.id} className="border-b border-cream-200 pb-3"><p className="font-bold">{event.subject}</p><p>{event.actor_name||'A care member'} · {event.action.replace(/_/g,' ')}</p><time className="text-sm text-ink-600">{new Date(event.created_at).toLocaleString(undefined,{timeZone:timezone})}</time></li>)}</ol></section>}
    <footer className="flex flex-wrap gap-4 mt-10 border-t border-cream-200 pt-5 text-sm text-ink-600"><button onClick={openPaywall} className="underline">Membership</button><button onClick={()=>setSupport(true)} className="underline">Contact support</button><span>Care changes are saved to your account.</span></footer>
  </main>{support&&<ContactModal isOpen onClose={()=>setSupport(false)}/>}</div>;
}
