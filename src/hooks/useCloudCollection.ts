import { useCallback, useEffect, useRef, useState } from 'react';
import { errorMessage } from '@/lib/supabaseClient';
export function useCloudCollection<T>(key: string, loader: () => Promise<T[]>) {
  const [data,setData] = useState<T[]>([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState<string | null>(null);
  const [busy,setBusy] = useState(false);
  const [lastSynced,setLastSynced] = useState<Date | null>(null);
  const loaderRef = useRef(loader); loaderRef.current = loader;
  const version = useRef(0), pending = useRef(false);
  const load = useCallback(async () => {
    const current = ++version.current;
    try { const result = await loaderRef.current(); if (version.current === current) {setData(result); setError(null); setLastSynced(new Date());} }
    catch (e) { if (version.current === current) { setData([]); setLastSynced(null); setError(errorMessage(e)); } }
    finally { if (version.current === current) setLoading(false); }
  },[]);
  useEffect(() => {
    setData([]); setLoading(true); setError(null); setLastSynced(null);
    void load();
    const update = () => { if (document.visibilityState === 'visible') void load(); };
    const changed = () => { void load(); };
    window.addEventListener('haven_data_changed',changed);
    window.addEventListener('online',update);
    document.addEventListener('visibilitychange',update);
    const timer = setInterval(update,30000);
    // The generation counter invalidates in-flight network requests on unmount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => { ++version.current; clearInterval(timer); window.removeEventListener('haven_data_changed',changed); window.removeEventListener('online',update); document.removeEventListener('visibilitychange',update); };
  },[key,load]);
  const mutate = async (action: () => Promise<unknown>): Promise<boolean> => {
    if (pending.current) return false;
    pending.current = true; setBusy(true); setError(null);
    try {
      await action();
      await load();
      window.dispatchEvent(new Event('haven_data_changed'));
      return true;
    } catch(e) { setError(errorMessage(e)); return false; }
    finally { pending.current = false; setBusy(false); }
  };
  return {data,loading,error,busy,lastSynced,refresh:load,mutate};
}
