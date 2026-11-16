const router = require('express').Router();
const bcrypt = require('bcryptjs');
const db = require('../db');
const { requiereLogin } = require('../middlewares/auth');
function usuarioPublico(u) { return { idUsuario: u.idUsuario, nombre: u.nombre, email: u.email, rol: u.rol }; }
router.post('/login', async (req, res, next) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = req.body?.password;
    if (!email || typeof password !== 'string' || password.length > 128)
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    const [rows] = await db.execute('SELECT idUsuario,nombre,email,passwordHash,rol,activo FROM usuarios WHERE email=? LIMIT 1', [email]);
    const u = rows[0];
    // Evita distinguir entre usuario inexistente y contraseña incorrecta.
    const fakeHash = '$2a$12$C6UzMDM.H6dfI/f/IKcEeO4Eu9iTCND4GH5jw9fG8kPM2s.D/cX5y';
    const ok = await bcrypt.compare(password, u?.passwordHash || fakeHash);
    if (!u || !u.activo || !ok) return res.status(401).json({ error: 'Credenciales inválidas' });
    req.session.regenerate(async (err) => {
      if (err) return next(err);
      req.session.usuario = usuarioPublico(u);
      try {
        await db.execute('UPDATE usuarios SET ultimoAcceso=NOW() WHERE idUsuario=?', [u.idUsuario]);
        req.session.save(e => e ? next(e) : res.json({ usuario: req.session.usuario }));
      } catch (e) { next(e); }
    });
  } catch (e) { next(e); }
});
router.get('/yo', requiereLogin, async (req, res, next) => {
  try {
    const [rows] = await db.execute('SELECT idUsuario,nombre,email,rol,activo FROM usuarios WHERE idUsuario=?', [req.session.usuario.idUsuario]);
    const u = rows[0];
    if (!u || !u.activo || u.rol !== req.session.usuario.rol) {
      return req.session.destroy(() => res.status(401).json({ error: 'Sesión no válida' }));
    }
    res.json({ usuario: usuarioPublico(u) });
  } catch (e) { next(e); }
});
router.post('/logout', (req, res, next) => {
  if (!req.session) return res.json({ mensaje: 'Sesión cerrada' });
  req.session.destroy(err => {
    if (err) return next(err);
    res.clearCookie('bytes.sid', { path: '/' });
    res.json({ mensaje: 'Sesión cerrada' });
  });
});
module.exports = router;
