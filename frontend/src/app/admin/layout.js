"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
export default function AdminLayout({children}){
 const router=useRouter(),[usuario,setUsuario]=useState(null),[cargando,setCargando]=useState(true);
 useEffect(()=>{api('/auth/yo').then(x=>setUsuario(x.usuario)).catch(()=>router.replace('/login')).finally(()=>setCargando(false))},[router]);
 async function salir(){try{await api('/auth/logout',{method:'POST',body:'{}'})}finally{router.replace('/login')}}
 if(cargando) return <p style={{padding:24}}>Comprobando sesión…</p>;
 if(!usuario) return null;
 return <div style={{maxWidth:1120,margin:'2rem auto',padding:'0 1rem'}}><header style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:16,flexWrap:'wrap',marginBottom:24}}><div><strong>Panel Bytes</strong><p style={{fontSize:13,opacity:.7}}>{usuario.nombre} ({usuario.rol})</p></div><nav style={{display:'flex',gap:18}}><Link href="/admin">Resumen</Link><Link href="/admin/novedades">Novedades</Link>{usuario.rol==='admin'&&<Link href="/admin/usuarios">Usuarios</Link>}<button onClick={salir} type="button">Cerrar sesión</button></nav></header>{children}</div>;
}
