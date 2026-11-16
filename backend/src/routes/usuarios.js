const router = require('express').Router();
const bcrypt = require('bcryptjs');
const db = require('../db');
const { requiereLogin, requiereAdmin } = require('../middlewares/auth');
router.use(requiereLogin, requiereAdmin);
const cols='idUsuario,nombre,email,rol,activo,ultimoAcceso,creadoEn';
const validoRol = r => ['admin','editor'].includes(r);
const validoEmail = e => typeof e === 'string' && e.length <= 150 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
router.get('/', async (req,res,next) => {
 try { const [rows]=await db.query(`SELECT ${cols} FROM usuarios ORDER BY idUsuario DESC`);res.json(rows); }
 catch(e){next(e)}
});
router.post('/', async (req,res,next) => {
 try {
  const { nombre, email, password, rol='editor' }=req.body || {};
  if(typeof nombre!=='string'||!nombre.trim()||nombre.length>100||!validoEmail(email)||!validoRol(rol)||typeof password!=='string'||password.length<10||password.length>72)
    return res.status(400).json({error:'Nombre, email, rol y contraseña de 10 a 72 caracteres son obligatorios'});
  const hash=await bcrypt.hash(password,12);
  const [result]=await db.execute('INSERT INTO usuarios(nombre,email,passwordHash,rol) VALUES(?,?,?,?)',[nombre.trim(),email.trim().toLowerCase(),hash,rol]);
  const [rows]=await db.execute(`SELECT ${cols} FROM usuarios WHERE idUsuario=?`,[result.insertId]);
  res.status(201).json(rows[0]);
 }catch(e){next(e)}
});
router.patch('/:id', async(req,res,next)=>{
 try {
  const id=Number(req.params.id);
  if(!Number.isSafeInteger(id)||id<1) return res.status(400).json({error:'ID inválido'});
  const [found]=await db.execute('SELECT * FROM usuarios WHERE idUsuario=?',[id]);
  const anterior=found[0]; if(!anterior) return res.status(404).json({error:'Usuario no encontrado'});
  const {nombre=anterior.nombre,email=anterior.email,rol=anterior.rol,activo=Boolean(anterior.activo),password}=req.body||{};
  if(typeof nombre!=='string'||!nombre.trim()||nombre.length>100||!validoEmail(email)||!validoRol(rol)||typeof activo!=='boolean'||(password!==undefined&&(typeof password!=='string'||password.length<10||password.length>72)))
    return res.status(400).json({error:'Datos de usuario inválidos'});
  // No permitir auto-desactivar ni quitarse el rol admin en la sesión actual.
  if(id===req.session.usuario.idUsuario && (!activo || rol!=='admin')) return res.status(400).json({error:'No podés desactivar tu propia cuenta ni quitarte el rol admin'});
  if(anterior.rol==='admin' && (rol!=='admin'||!activo)) {
    const [count]=await db.query("SELECT COUNT(*) total FROM usuarios WHERE rol='admin' AND activo=1");
    if(count[0].total<=1) return res.status(400).json({error:'Debe existir al menos un administrador activo'});
  }
  const hash=password===undefined?anterior.passwordHash:await bcrypt.hash(password,12);
  await db.execute('UPDATE usuarios SET nombre=?,email=?,rol=?,activo=?,passwordHash=? WHERE idUsuario=?',[nombre.trim(),email.trim().toLowerCase(),rol,activo?1:0,hash,id]);
  const [rows]=await db.execute(`SELECT ${cols} FROM usuarios WHERE idUsuario=?`,[id]);
  if(id===req.session.usuario.idUsuario) req.session.usuario={idUsuario:id,nombre:rows[0].nombre,email:rows[0].email,rol:rows[0].rol};
  res.json(rows[0]);
 }catch(e){next(e)}
});
module.exports=router;
