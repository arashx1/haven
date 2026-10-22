import {useState} from 'react';
import {X} from 'lucide-react';
import {useDialog} from '@/hooks/useDialog';
import {supabase,errorMessage} from '@/lib/supabaseClient';
export function ContactModal({onClose}:{isOpen:boolean;onClose:()=>void}){
  const ref=useDialog(onClose);
  const [message,setMessage]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState(''),[saved,setSaved]=useState(false);
  const submit=async(e:React.FormEvent)=>{
    e.preventDefault();setBusy(true);setError('');
    try{const {data,error:authError}=await supabase.auth.getUser();if(authError||!data.user)throw new Error('Please sign in again.');const {error}=await supabase.from('support_requests').insert({user_id:data.user.id,message:message.trim()});if(error)throw error;setSaved(true);setMessage('');}
    catch(e){setError(errorMessage(e));}finally{setBusy(false);}
  };
  return <div className="modal-backdrop"><div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="support-title" className="modal-card"><div className="flex justify-between items-center"><h2 id="support-title" className="section-title text-2xl">Contact support</h2><button className="icon-button" onClick={onClose} aria-label="Close support"><X/></button></div><p className="my-4">Send an app issue or feedback. This inbox is not an emergency service and response times are not guaranteed. Avoid including medical details.</p>{saved?<p role="status" className="notice">Your request was saved to the support inbox.</p>:<form onSubmit={submit} className="space-y-4"><label className="field-label">Your message<textarea required minLength={10} maxLength={3000} rows={5} value={message} onChange={e=>setMessage(e.target.value)} className="field-input"/></label>{error&&<p role="alert" className="error-message">{error}</p>}<button disabled={busy} className="btn-primary w-full">{busy?'Saving…':'Submit request'}</button></form>}</div></div>;
}
