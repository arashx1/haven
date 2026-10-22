let context:AudioContext|null=null;
function getContext(){
 const Constructor=window.AudioContext||(window as unknown as {webkitAudioContext:typeof AudioContext}).webkitAudioContext;
 if(!Constructor)return null;
 if(!context||context.state==='closed')context=new Constructor();
 if(context.state==='suspended')void context.resume().catch(()=>undefined);
 return context;
}
function tone(frequency:number,delay:number,duration:number){
 try{
  const ctx=getContext();if(!ctx)return;
  const oscillator=ctx.createOscillator(),gain=ctx.createGain(),start=ctx.currentTime+delay;
  oscillator.type='sine';oscillator.frequency.setValueAtTime(frequency,start);
  gain.gain.setValueAtTime(.06,start);gain.gain.exponentialRampToValueAtTime(.001,start+duration);
  oscillator.connect(gain);gain.connect(ctx.destination);
  oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};
  oscillator.start(start);oscillator.stop(start+duration);
 }catch{/* Audio is optional. */}
}
export function playTapSound(){tone(440,0,.09);}
export function playSuccessChime(){[523.25,659.25,783.99].forEach((frequency,index)=>tone(frequency,index*.12,.4));}
