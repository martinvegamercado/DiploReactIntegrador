const router = require('express').Router();
const db = require('../db');
const { requiereLogin } = require('../middlewares/auth');
router.get('/resumen', requiereLogin, async(req,res,next)=>{
 try {
  const [[u],[s],[p],[n],[c]] = await Promise.all([
   db.query('SELECT COUNT(*) total FROM usuarios WHERE activo=1'),
   db.query('SELECT COUNT(*) total FROM servicios WHERE activo=1'),
   db.query('SELECT COUNT(*) total FROM productos WHERE publicado=1'),
   db.query("SELECT COUNT(*) total FROM novedades WHERE estado='publicada'"),
   db.query("SELECT COUNT(*) total FROM contactos WHERE estado='nuevo'")
  ]);
  res.json({usuarios:u[0].total, servicios:s[0].total, productos:p[0].total, novedades:n[0].total, contactosNuevos:c[0].total});
 } catch(e){next(e)}
});
module.exports=router;
