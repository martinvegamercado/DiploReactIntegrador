"use client";
import {useState} from 'react';
import {api} from '@/lib/api';
export default function Contacto(){
 const [form,setForm]=useState({nombre:'',email:'',mensaje:'',web:''}),[enviando,setEnviando]=useState(false);
 const [error,setError]=useState(''),[exito,setExito]=useState('');
 async function enviar(e){e.preventDefault();setEnviando(true);setError('');setExito('');try{
  const r=await api('/contacto',{method:'POST',body:JSON.stringify(form)});setExito(r.mensaje||'Mensaje enviado');setForm({nombre:'',email:'',mensaje:'',web:''});
 }catch(e){setError(e.message)}finally{setEnviando(false)}}
 return <section className="contact"><h1>Contáctanos</h1><p className="subtitle">¿Tenés un proyecto en mente? Hablemos.</p>
 <div className="contact-container"><form onSubmit={enviar} className="contact-form">
 <div className="form-group"><label htmlFor="name">Nombre completo</label><input type="text" id="name" name="nombre" required maxLength={120} placeholder="Tu nombre" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})}/></div>
 <div className="form-group"><label htmlFor="email">Correo electrónico</label><input type="email" id="email" name="email" required maxLength={150} placeholder="tu@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
 <div className="form-group"><label htmlFor="message">Mensaje</label><textarea id="message" name="mensaje" rows={6} maxLength={5000} required placeholder="Contanos sobre tu proyecto…" value={form.mensaje} onChange={e=>setForm({...form,mensaje:e.target.value})}/></div>
 <div style={{display:'none'}} aria-hidden="true"><label htmlFor="web">Sitio web</label><input id="web" name="web" tabIndex={-1} autoComplete="off" value={form.web} onChange={e=>setForm({...form,web:e.target.value})}/></div>
 <button type="submit" className="btn btn-full" disabled={enviando}>{enviando?'Enviando…':'Enviar mensaje'}</button>
 {error&&<p role="alert" style={{color:'crimson'}}>{error}</p>}{exito&&<p role="status">{exito}</p>}</form></div></section>;
}
