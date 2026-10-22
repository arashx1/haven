import {useEffect,useState,useCallback} from 'react';
import {useApp} from '@/context/AppContext';
import {supabase,errorMessage} from '@/lib/supabaseClient';
export function CareCircle(){
  const {session,patientId,refreshProfiles}=useApp();
  const [members,setMembers]=useState<{id:string;caregiver_id:string;caregiver_name:string}[]>([]);
  const [email,setEmail]=useState(''),[code,setCode]=useState(''),[invitation,setInvitation]=useState(''),[error,setError]=useState(''),[notice,setNotice]=useState('');
  const [busy,setBusy]=useState(false);
  const isOwner=patientId===session?.user.id;
  const load=useCallback(async()=>{
    const {data,error}=await supabase.rpc('list_care_members',{owner:patientId});
    if(error)setError(error.message);else setMembers(data||[]);
  },[patientId]);
  useEffect(()=>{void load();},[load]);
  const invite=async(e:React.FormEvent)=>{
    e.preventDefault();setBusy(true);setError('');setInvitation('');
    try{const {data,error}=await supabase.rpc('create_care_invitation',{recipient:email.trim().toLowerCase()});if(error)throw error;setInvitation(String(data));}
    catch(e){setError(errorMessage(e));}finally{setBusy(false);}
  };
  const join=async(e:React.FormEvent)=>{
    e.preventDefault();setBusy(true);setError('');setNotice('');
    try{const {error}=await supabase.rpc('accept_care_invitation',{invitation_code:code.trim()});if(error)throw error;setCode('');await refreshProfiles();setNotice('Care access accepted. Select the shared care profile above.');await load();}
    catch(e){setError(errorMessage(e));}finally{setBusy(false);}
  };
  const revoke=async(id:string)=>{
    if(!window.confirm('Remove this helper’s access to this care profile?'))return;
    setBusy(true);setError('');
    try{const {error}=await supabase.from('caregiver_access').delete().eq('id',id).select('id').single();if(error)throw error;await load();}
    catch(e){setError(errorMessage(e));}finally{setBusy(false);}
  };
  return <section className="card-base p-6 space-y-5"><h2 className="section-title text-2xl">Your care circle</h2><p>Invite someone you trust to view and manage your reminders, contacts, photos, and activity. Each person signs in to their own account.</p>
    {error&&<p role="alert" className="error-message">{error}</p>}{notice&&<p role="status" className="notice">{notice}</p>}
    {isOwner&&<form onSubmit={invite} className="space-y-3"><label className="field-label">Helper’s account email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="field-input"/></label><button disabled={busy} className="btn-primary">{busy?'Please wait…':'Create private invitation'}</button><p className="text-sm text-ink-600">Invitations expire in 24 hours, can be used once, and only work for the verified email you enter. Creating a new invitation invalidates previous unused invitations for that email.</p></form>}
    {invitation&&<div className="notice"><p className="font-bold">Share this code privately with your helper.</p><code className="block break-all select-all my-3">{invitation}</code><p>We have not sent an email. The recipient can paste this code below after signing in.</p></div>}
    <div><h3 className="font-bold mb-3">People with access</h3>{!members.length&&<p className="text-ink-600">No helpers have joined this profile.</p>}{members.map(member=><div className="flex gap-3 justify-between py-3 border-b border-cream-200" key={member.id}><span>{member.caregiver_name||'Helper'}</span>{isOwner&&<button disabled={busy} onClick={()=>void revoke(member.id)} className="text-coral-700 font-bold">Remove access</button>}</div>)}</div>
    <form onSubmit={join} className="space-y-3 border-t border-cream-200 pt-5"><h3 className="font-bold">Helping someone else?</h3><label className="field-label">Their invitation code<input required minLength={32} value={code} onChange={e=>setCode(e.target.value)} className="field-input" autoComplete="off"/></label><button disabled={busy} className="btn-secondary">Accept invitation</button></form>
  </section>;
}
