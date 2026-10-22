import {type ReactNode} from 'react';
import {Image} from 'lucide-react';
export function Illustration({label,className='',rounded='rounded-3xl'}:{id?:string;label?:string;className?:string;rounded?:string}){
 return <div className={rounded+' bg-cream-200 flex items-center justify-center '+className}><div className="text-center p-4"><Image className="w-12 h-12 text-ink-500 mx-auto" aria-hidden="true"/>{label&&<p className="mt-3 text-ink-700 font-bold">{label}</p>}<p className="text-ink-600 text-sm mt-2">No photo added yet</p></div></div>;
}
export function GameThumbnail({icon,gradient,className=''}:{icon:ReactNode;gradient:string;className?:string}){
 return <div className={'rounded-3xl bg-gradient-to-br '+gradient+' flex items-center justify-center '+className}><div className="text-white">{icon}</div></div>;
}
