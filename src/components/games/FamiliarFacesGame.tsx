import {useState} from 'react';
import {usePeople} from '@/hooks/usePeople';
import {useApp} from '@/context/AppContext';
import {LoadingState,ErrorState} from '@/components/UI';
export function FamiliarFacesGame({onFinish}:{onFinish:()=>void}){
  const {people,loading,error,refresh}=usePeople();
  const {navigate}=useApp();
  const [index,setIndex]=useState(0),[revealed,setRevealed]=useState(false);
  const photos=people.filter(p=>p.image.startsWith('https:')||p.image.startsWith('data:image/'));
  if(loading)return <LoadingState message="Finding familiar faces…"/>;
  if(error)return <ErrorState message={error} onRetry={refresh}/>;
  if(!photos.length)return <div className="text-center"><h2 className="section-title text-2xl">Start with a familiar face.</h2><p className="my-4">Add a photo to one of your saved contacts to enjoy this activity.</p><button onClick={()=>navigate('caregiver-dashboard')} className="btn-primary">Add a family photo</button></div>;
  const person=photos[index%photos.length];
  const next=()=>{if(index+1===photos.length)onFinish();else{setIndex(i=>i+1);setRevealed(false);}};
  return <div className="max-w-md mx-auto text-center"><p className="eyebrow">Familiar faces · {index+1} of {photos.length}</p><h2 className="section-title text-2xl my-4">Someone in your circle.</h2><img src={person.image} alt={revealed?person.name:'A person from your saved contacts'} className="w-full aspect-square object-cover rounded-3xl"/>
    {revealed?<div role="status" className="my-5"><h3 className="text-2xl font-bold">{person.name}</h3><p className="text-honey-700 font-bold">{person.relationship}</p><p className="mt-3">{person.info}</p></div>:<p className="my-5">Take your time. Tap below when you would like a reminder.</p>}
    <button className="btn-primary w-full" onClick={revealed?next:()=>setRevealed(true)}>{revealed?(index+1===photos.length?'Finish':'Another familiar face'):'Tell me about this person'}</button>
  </div>;
}
