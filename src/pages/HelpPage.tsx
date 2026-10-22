import {usePeople} from '@/hooks/usePeople';
import {useApp} from '@/context/AppContext';
import {phoneHref} from '@/utils/reminders';
import {Phone,Volume2,Settings} from 'lucide-react';
import {ErrorState,LoadingState} from '@/components/UI';
export function HelpPage(){
  const {people,loading,error,refresh}=usePeople();
  const {navigate,language}=useApp();
  const contacts=people.filter(person=>phoneHref(person.phone));
  const speak=(text:string)=>{if('speechSynthesis' in window){window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang=language;utterance.rate=.85;window.speechSynthesis.speak(utterance);}};
  return <div className="max-w-2xl mx-auto space-y-5"><p className="eyebrow">Someone familiar</p><h1 className="section-title text-3xl">Let’s find a helping hand.</h1><p className="text-lg text-ink-600">Choose a saved contact to open your device’s calling app.</p>
    {loading&&<LoadingState message="Loading contacts…"/>}{error&&<ErrorState message={error} onRetry={refresh}/>}
    {contacts.map(person=><a key={person.id} href={phoneHref(person.phone)!} className="card-base p-6 flex items-center gap-4"><Phone className="w-9 h-9 text-sage-700"/><span><strong className="block text-2xl">{person.name}</strong><span className="text-ink-600">{person.relationship} · {person.phone}</span></span></a>)}
    {!loading&&!error&&!contacts.length&&<div className="empty-card"><p>No phone contacts have been saved yet.</p><button onClick={()=>navigate('caregiver-dashboard')} className="btn-primary mt-4"><Settings/>Add family contacts</button></div>}
    <section className="card-base p-5"><h2 className="section-title text-xl">Say it out loud</h2><div className="grid sm:grid-cols-2 gap-3 mt-4">{['I need help, please.','I would like some water.','I would like to call my family.','I am uncomfortable.'].map(text=><button key={text} className="btn-secondary text-base p-4" onClick={()=>speak(text)}><Volume2 className="shrink-0"/>{text}</button>)}</div></section>
    <p className="text-sm text-ink-600">Haven does not dispatch emergency assistance. For an emergency, contact your local emergency service directly.</p>
  </div>;
}
