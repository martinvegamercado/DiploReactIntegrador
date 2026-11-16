function requiereLogin(req, res, next) {
  if (!req.session?.usuario) return res.status(401).json({ error: 'Iniciá sesión' });
  next();
}
function requiereAdmin(req, res, next) {
  if (req.session?.usuario?.rol !== 'admin') return res.status(403).json({ error: 'Se requiere rol administrador' });
  next();
}
module.exports = { requiereLogin, requiereAdmin };
