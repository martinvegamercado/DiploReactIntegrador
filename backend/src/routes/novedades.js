const router = require('express').Router();
const db = require('../db');
const { requiereLogin } = require('../middlewares/auth');

// La consulta pública nunca devuelve borradores.
router.get('/publicas', async (req, res, next) => {
 try {
  const [rows] = await db.query(`SELECT n.idNovedad,n.titulo,n.slug,n.resumen,n.contenido,n.imagenUrl,
      n.fechaPublicacion,c.nombre AS categoria
    FROM novedades n LEFT JOIN categorias c ON c.idCategoria=n.idCategoria
    WHERE n.estado='publicada' AND (n.fechaPublicacion IS NULL OR n.fechaPublicacion<=NOW())
    ORDER BY n.fechaPublicacion DESC,n.idNovedad DESC`);
  res.json(rows);
 } catch(e) {next(e)}
});
router.get('/categorias', requiereLogin, async (req,res,next)=>{
 try { const [rows]=await db.query("SELECT idCategoria,nombre FROM categorias WHERE tipo='novedad' AND activa=1 ORDER BY nombre");res.json(rows) }
 catch(e){next(e)}
});
router.get('/', requiereLogin, async(req,res,next)=>{
 try {
  const [rows]=await db.query(`SELECT n.*,c.nombre AS categoria FROM novedades n
    LEFT JOIN categorias c ON c.idCategoria=n.idCategoria ORDER BY n.creadoEn DESC,n.idNovedad DESC`);
  res.json(rows);
 }catch(e){next(e)}
});
function validar(body) {
 const titulo=String(body.titulo??'').trim(), slug=String(body.slug??'').trim().toLowerCase();
 const contenido=String(body.contenido??'').trim(), resumen=String(body.resumen??'').trim();
 const imagenUrl=String(body.imagenUrl??'').trim();
 const estado=body.estado;
 const idCategoria=body.idCategoria==null||body.idCategoria===''?null:Number(body.idCategoria);
 if(!titulo||titulo.length>200||!contenido||contenido.length>50000||!resumen||resumen.length>400)
  return {error:'Completá título, resumen y contenido respetando los límites'};
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)||slug.length>220) return {error:'Slug inválido: usá letras minúsculas, números y guiones'};
 if(!['borrador','publicada'].includes(estado)) return {error:'Estado inválido'};
 if(imagenUrl.length>500|| (imagenUrl && !(/^\/[^/]/.test(imagenUrl)||/^https:\/\//i.test(imagenUrl)))) return {error:'URL de imagen inválida: ruta local o HTTPS'};
 if(idCategoria!==null&&(!Number.isSafeInteger(idCategoria)||idCategoria<=0))return {error:'Categoría inválida'};
 return {data:{titulo,slug,resumen,contenido,imagenUrl:imagenUrl||null,estado,idCategoria}};
}
async function validarCategoria(id){
 if(id===null) return true;
 const [[r]]=await db.query("SELECT COUNT(*) AS total FROM categorias WHERE idCategoria=? AND tipo='novedad' AND activa=1",[id]);return r.total>0;
}
router.post('/', requiereLogin, async(req,res,next)=>{
 try {
  const v=validar(req.body);if(v.error)return res.status(400).json({error:v.error});
  const d=v.data;if(!await validarCategoria(d.idCategoria))return res.status(400).json({error:'Categoría no válida para novedades'});
  const [r]=await db.query(`INSERT INTO novedades
   (idCategoria,titulo,slug,resumen,contenido,imagenUrl,estado,fechaPublicacion,autorId)
   VALUES (?,?,?,?,?,?,?,IF(?='publicada',NOW(),NULL),?)`,
   [d.idCategoria,d.titulo,d.slug,d.resumen,d.contenido,d.imagenUrl,d.estado,d.estado,req.session.usuario.idUsuario]);
  res.status(201).json({idNovedad:r.insertId});
 }catch(e){next(e)}
});
router.put('/:id', requiereLogin, async(req,res,next)=>{
 try {
  const id=Number(req.params.id);if(!Number.isSafeInteger(id)||id<=0)return res.status(400).json({error:'ID inválido'});
  const v=validar(req.body);if(v.error)return res.status(400).json({error:v.error});
  const d=v.data;if(!await validarCategoria(d.idCategoria))return res.status(400).json({error:'Categoría no válida para novedades'});
  const [r]=await db.query(`UPDATE novedades SET idCategoria=?,titulo=?,slug=?,resumen=?,contenido=?,imagenUrl=?,estado=?,
    fechaPublicacion=CASE WHEN ?='publicada' THEN COALESCE(fechaPublicacion,NOW()) ELSE NULL END
    WHERE idNovedad=?`,[d.idCategoria,d.titulo,d.slug,d.resumen,d.contenido,d.imagenUrl,d.estado,d.estado,id]);
  if(!r.affectedRows)return res.status(404).json({error:'Novedad no encontrada'});
  res.json({ok:true});
 }catch(e){next(e)}
});
router.delete('/:id', requiereLogin, async(req,res,next)=>{
 try {
  const id=Number(req.params.id);if(!Number.isSafeInteger(id)||id<=0)return res.status(400).json({error:'ID inválido'});
  const [r]=await db.query('DELETE FROM novedades WHERE idNovedad=?',[id]);
  if(!r.affectedRows)return res.status(404).json({error:'Novedad no encontrada'});
  res.json({ok:true});
 }catch(e){next(e)}
});
module.exports=router;
