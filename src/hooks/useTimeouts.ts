import {useCallback,useEffect,useRef} from 'react';
export function useTimeouts(){
 const timers=useRef(new Set<ReturnType<typeof setTimeout>>());
 const clear=useCallback(()=>{timers.current.forEach(clearTimeout);timers.current.clear();},[]);
 const schedule=useCallback((callback:()=>void,delay:number)=>{
   const timer=setTimeout(()=>{timers.current.delete(timer);callback();},delay);
   timers.current.add(timer);return timer;
 },[]);
 useEffect(()=>clear,[clear]);
 return {schedule,clear};
}
