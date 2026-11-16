"use client";
import { useEffect,useState } from 'react';
import { api } from '@/lib/api';
const vacio={titulo:'',slug:'',resumen:'',contenido:'',imagenUrl:'',estado:'borrador',idCategoria:''};
const slugify=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export default function AdministrarNovedades(){
 const [lista,setLista]=useState([]),[categorias,setCategorias]=useState([]),[form,setForm]=useState(vacio);
 const [idEditar,setIdEditar]=useState(null),[error,setError]=useState(''),[aviso,setAviso]=useState(''),[guardando,setGuardando]=useState(false);
 async function cargar(){const [n,c]=await Promise.all([api('/novedades'),api('/novedades/categorias')]);setLista(n);setCategorias(c)}
 useEffect(()=>{cargar().catch(e=>setError(e.message))},[]);
 function limpiar(){setIdEditar(null);setForm(vacio)}
 function editar(n){setIdEditar(n.idNovedad);setForm({titulo:n.titulo,slug:n.slug,resumen:n.resumen||'',contenido:n.contenido,imagenUrl:n.imagenUrl||'',estado:n.estado,idCategoria:n.idCategoria??''});setError('');setAviso('');window.scrollTo({top:0,behavior:'smooth'})}
 async function guardar(e){e.preventDefault();setGuardando(true);setError('');setAviso('');try{
  const body={...form,idCategoria:form.idCategoria||null};await api(idEditar?`/novedades/${idEditar}`:'/novedades',{method:idEditar?'PUT':'POST',body:JSON.stringify(body)});
  limpiar();await cargar();setAviso('Novedad guardada correctamente');
 }catch(e){setError(e.message)}finally{setGuardando(false)}}
 async function borrar(n){if(!window.confirm(`¿Eliminar definitivamente "${n.titulo}"?`))return;try{setError('');setAviso('');await api(`/novedades/${n.idNovedad}`,{method:'DELETE'});await cargar();setAviso('Novedad eliminada')}catch(e){setError(e.message)}}
 const input={padding:10,width:'100%',boxSizing:'border-box'};
 return <section><h1>Administrar novedades</h1><p>Creá, editá, publicá o eliminá noticias del sitio público.</p>
 <h2 style={{fontSize:20,marginTop:24}}>{idEditar?'Editar novedad':'Nueva novedad'}</h2>
 <form onSubmit={guardar} style={{display:'grid',gap:12,maxWidth:760,margin:'16px 0 32px'}}>
 <label>Título<input style={input} required maxLength={200} value={form.titulo} onChange={e=>setForm({...form,titulo:e.target.value,slug:idEditar?form.slug:slugify(e.target.value)})}/></label>
 <label>Slug (para URL)<input style={input} required maxLength={220} pattern="[a-z0-9]+(-[a-z0-9]+)*" value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})}/></label>
 <label>Resumen<textarea style={input} required maxLength={400} rows={2} value={form.resumen} onChange={e=>setForm({...form,resumen:e.target.value})}/></label>
 <label>Contenido<textarea style={input} required maxLength={50000} rows={8} value={form.contenido} onChange={e=>setForm({...form,contenido:e.target.value})}/></label>
 <label>Imagen (URL HTTPS o ruta /img/... opcional)<input style={input} maxLength={500} value={form.imagenUrl} onChange={e=>setForm({...form,imagenUrl:e.target.value})}/></label>
 <label>Categoría <select style={input} value={form.idCategoria} onChange={e=>setForm({...form,idCategoria:e.target.value})}><option value="">Sin categoría</option>{categorias.map(c=><option key={c.idCategoria} value={c.idCategoria}>{c.nombre}</option>)}</select></label>
 <label>Estado <select style={input} value={form.estado} onChange={e=>setForm({...form,estado:e.target.value})}><option value="borrador">Borrador</option><option value="publicada">Publicada</option></select></label>
 <div style={{display:'flex',gap:12}}><button className="btn" type="submit" disabled={guardando}>{guardando?'Guardando…':'Guardar novedad'}</button>{idEditar&&<button type="button" onClick={limpiar}>Cancelar edición</button>}</div>
 </form>
 {error&&<p role="alert" style={{color:'crimson'}}>{error}</p>}{aviso&&<p role="status">{aviso}</p>}
 <h2 style={{fontSize:20}}>Novedades registradas</h2>
 <div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse'}}><thead><tr>{['Título','Categoría','Estado','Acciones'].map(x=><th key={x} style={{textAlign:'left',padding:12,borderBottom:'1px solid #9996'}}>{x}</th>)}</tr></thead><tbody>{lista.map(n=><tr key={n.idNovedad}><td style={{padding:12}}>{n.titulo}</td><td style={{padding:12}}>{n.categoria||'—'}</td><td style={{padding:12}}>{n.estado}</td><td style={{padding:12,whiteSpace:'nowrap'}}><button onClick={()=>editar(n)} type="button">Editar</button> <button onClick={()=>borrar(n)} type="button">Eliminar</button></td></tr>)}</tbody></table>{!lista.length&&<p>No hay novedades registradas.</p>}</div></section>;
}
