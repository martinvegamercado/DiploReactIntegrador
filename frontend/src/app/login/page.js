"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
export default function Login(){
 const router=useRouter();const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[error,setError]=useState(''),[loading,setLoading]=useState(false);
 async function entrar(e){e.preventDefault();setError('');setLoading(true);try{await api('/auth/login',{method:'POST',body:JSON.stringify({email,password})});router.replace('/admin')}catch(e){setError(e.message)}finally{setLoading(false)}}
 return <section style={{maxWidth:440,margin:'3rem auto',padding:'1.5rem'}}><h1>Acceso administrativo</h1><form onSubmit={entrar} style={{display:'grid',gap:14,marginTop:20}}><label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required style={{width:'100%',padding:12}} /></label><label>Contraseña<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required style={{width:'100%',padding:12}} /></label>{error&&<p role="alert" style={{color:'crimson'}}>{error}</p>}<button className="btn" disabled={loading}>{loading?'Ingresando…':'Ingresar'}</button></form></section>;
}
