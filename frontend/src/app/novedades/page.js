"use client";
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {api} from '@/lib/api';
export default function Novedades(){
 const [lista,setLista]=useState([]),[error,setError]=useState(''),[cargando,setCargando]=useState(true);
 useEffect(()=>{api('/novedades/publicas').then(setLista).catch(e=>setError(e.message)).finally(()=>setCargando(false))},[]);
 return <section className="news"><h1>Novedades</h1><p className="subtitle">Últimas noticias y actualizaciones del equipo de Bytes.</p>
 {cargando&&<p>Cargando novedades…</p>}{error&&<p role="alert">No se pudieron cargar las novedades: {error}</p>}
 <div className="service-cards">{lista.map(n=><article className="card" key={n.idNovedad} style={{textAlign:'left',whiteSpace:'pre-wrap'}}>
 {n.imagenUrl&&<img src={n.imagenUrl} alt="" style={{maxWidth:'100%',height:'auto'}}/>}
 <h2>{n.titulo}</h2><small>{n.categoria||'Novedades'} {n.fechaPublicacion&&' · '+new Date(n.fechaPublicacion).toLocaleDateString('es-AR')}</small>
 {n.resumen&&<p><strong>{n.resumen}</strong></p>}<p>{n.contenido}</p>
 <Link href="/contacto">Consultanos</Link></article>)}</div>
 {!cargando&&!error&&!lista.length&&<p>Próximamente publicaremos novedades.</p>}</section>;
}
