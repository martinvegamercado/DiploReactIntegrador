require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const cors = require('cors');
const db = require('./db');
const app = express();
const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';
const secret = process.env.SESSION_SECRET;
if (!secret || secret.length < 32) throw new Error('Configurá SESSION_SECRET de al menos 32 caracteres en .env');
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(cors({ origin: frontend, credentials: true }));
app.use(express.json({ limit:'100kb' }));
// Protección de escritura de origen para las rutas con cookie de sesión.
app.use((req,res,next)=>{
  if(['POST','PUT','PATCH','DELETE'].includes(req.method)) {
    if (req.get('Origin') !== frontend) return res.status(403).json({error:'Origen no autorizado'});
    if (!req.is('application/json')) return res.status(415).json({error:'Se requiere JSON'});
  }
  next();
});
const store = new MySQLStore({
 host:process.env.DB_HOST || '127.0.0.1', port:Number(process.env.DB_PORT||3306),
 user:process.env.DB_USER||'root', password:process.env.DB_PASSWORD||'',
 database:process.env.DB_NAME||'bytes_informatica', createDatabaseTable:true,
 schema:{tableName:'sesiones'}
});
app.use(session({
 name:'bytes.sid', secret, store, resave:false, saveUninitialized:false,
 cookie:{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',maxAge:8*60*60*1000}
}));
app.get('/api/salud',async(req,res,next)=>{try{await db.query('SELECT 1');res.json({ok:true})}catch(e){next(e)}});
app.use('/api/auth', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/novedades', require('./routes/novedades'));
app.use('/api/contacto', require('./routes/contacto'));
app.use((req,res)=>res.status(404).json({error:'Ruta no encontrada'}));
app.use((err,req,res,next)=>{
 console.error(err);
 if(err.code==='ER_DUP_ENTRY') return res.status(409).json({error:'El email ya está registrado'});
 res.status(500).json({error:'Error interno del servidor'});
});
const port=Number(process.env.PORT||3001);
app.listen(port,()=>console.log(`Bytes API http://localhost:${port}`));
