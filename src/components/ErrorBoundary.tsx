import {Component,type ReactNode} from 'react';
export class ErrorBoundary extends Component<{children:ReactNode},{failed:boolean}> {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed ? <main className="max-w-lg mx-auto p-8"><h1 className="section-title text-3xl">Something interrupted Haven.</h1><p className="my-5">Your saved account data is still stored. Reload to try again.</p><button className="btn-primary" onClick={()=>location.reload()}>Reload Haven</button></main>:this.props.children;}
}
