import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { supabase, errorMessage } from '@/lib/supabaseClient';
import { TopBar } from '@/components/TopBar';
export function LoginPage({ signup = false }: { signup?: boolean }) {
  const { navigate } = useApp();
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState('');
  const [notice,setNotice] = useState('');
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setError(''); setNotice('');
    try {
      if (signup) {
        if (!name.trim()) throw new Error("Enter your name.");
        const {data,error} = await supabase.auth.signUp({email:email.trim(),password,options:{emailRedirectTo:location.origin, data:{full_name:name.trim(),timezone:Intl.DateTimeFormat().resolvedOptions().timeZone}}});
        if (error) throw error;
        if (data.session) navigate('onboarding');
        else setNotice('Check your email to confirm your account, then sign in. You can access your care tools after signing in.');
      } else {
        const {error} = await supabase.auth.signInWithPassword({email:email.trim(),password});
        if (error) throw error;
        navigate('my-day');
      }
    } catch(e) { setError(errorMessage(e)); }
    finally { setBusy(false); }
  };
  const reset = async () => {
    if (!email.trim()) { setError('Enter your email address first.'); return; }
    setBusy(true); setError('');
    try {
      const {error} = await supabase.auth.resetPasswordForEmail(email.trim(),{redirectTo:location.origin + '/?recovery=1'});
      if (error) throw error;
      setNotice('If this email has an account, a password reset link will arrive shortly.');
    } catch(e) { setError(errorMessage(e)); }
    finally { setBusy(false); }
  };
  return <div className="min-h-screen bg-cream-50"><TopBar /><main id="main-content" tabIndex={-1} className="max-w-md mx-auto px-4 py-10">
    <div className="card-base p-6 sm:p-8"><p className="eyebrow">A little help, every day</p><h1 className="section-title text-3xl mt-2">{signup ? 'Make room for care.' : 'Welcome to Haven.'}</h1>
    <p className="text-ink-600 my-4">{signup ? 'Create your own account. You can invite a trusted helper after signing in.' : 'Your routines, familiar faces, and memories, together in one quiet place.'}</p>
    <form onSubmit={submit} className="space-y-4">
      {signup && <label className="field-label">Your name<input autoComplete="name" required maxLength={100} value={name} onChange={e=>setName(e.target.value)} className="field-input" /></label>}
      <label className="field-label">Email<input type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} className="field-input" /></label>
      <label className="field-label">Password<input type="password" required minLength={signup ? 8 : 1} autoComplete={signup ? 'new-password' : 'current-password'} value={password} onChange={e=>setPassword(e.target.value)} className="field-input" /></label>
      {signup && <p className="text-sm text-ink-500">Use at least 8 characters. Your care information is private to you and helpers you explicitly invite.</p>}
      {error && <p role="alert" className="error-message">{error}</p>}{notice && <p role="status" className="notice">{notice}</p>}
      <button disabled={busy} className="btn-primary w-full" type="submit">{busy ? 'Please waitÃ¢â‚¬Â¦' : signup ? 'Create account' : 'Sign in'}</button>
    </form>
    {!signup && <button onClick={reset} disabled={busy} className="text-honey-700 font-bold py-4">Forgot password?</button>}
    <button onClick={()=>navigate(signup ? 'login':'signup')} className="btn-secondary w-full mt-3">{signup ? 'Already have an account? Sign in' : 'Create a new account'}</button>
    </div><p className="text-sm text-ink-500 mt-5 text-center">Haven helps organize everyday care. It is not an emergency response service.</p>
  </main></div>;
}
export function ResetPasswordPage() {
  const {navigate} = useApp();
  const [password,setPassword] = useState(''), [confirm,setConfirm] = useState(''), [error,setError] = useState('');
  const [busy,setBusy] = useState(false);
  const submit = async (e:React.FormEvent) => {
    e.preventDefault(); setError('');
    if (password !== confirm) {setError('Passwords do not match.'); return;}
    setBusy(true);
    try {
      const {error} = await supabase.auth.updateUser({password});
      if(error) throw error;
      history.replaceState(null,'',location.pathname);
      navigate('my-day'); location.reload();
    } catch(e) {setError(errorMessage(e));} finally {setBusy(false);}
  };
  return <main className="max-w-md mx-auto p-6"><form onSubmit={submit} className="card-base p-6 space-y-4"><h1 className="section-title text-2xl">Choose a new password</h1>
    <label className="field-label">New password<input required type="password" minLength={8} autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} className="field-input" /></label>
    <label className="field-label">Confirm password<input required type="password" minLength={8} autoComplete="new-password" value={confirm} onChange={e=>setConfirm(e.target.value)} className="field-input" /></label>
    {error && <p role="alert" className="error-message">{error}</p>}<button disabled={busy} className="btn-primary w-full">{busy ? 'SavingÃ¢â‚¬Â¦' : 'Save password'}</button>
  </form></main>;
}
