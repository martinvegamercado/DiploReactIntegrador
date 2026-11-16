const router = require('express').Router();
const db = require('../db');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
// Limitador local: para varios servidores, usar un store compartido (Redis, etc.).
const limiter = rateLimit({windowMs:15*60*1000,limit:5,standardHeaders:'draft-7',legacyHeaders:false,
 message:{error:'Demasiados mensajes. Intentá más tarde.'}});
const clean=v=>String(v??'').trim();
router.post('/',limiter,async(req,res,next)=>{
 try {
  const {nombre,email,mensaje,web}=req.body||{};
  // Honeypot: el campo web no debe rellenarse por usuarios reales.
  if(web)return res.json({ok:true});
  const n=clean(nombre),e=clean(email),m=clean(mensaje);
  if(!n||n.length>120||!e||e.length>150||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)||!m||m.length>5000)
   return res.status(400).json({error:'Revisá nombre, email y mensaje (máximo 5000 caracteres).'});
  // Guardar primero para no perder el contacto si falla SMTP.
  const [r]=await db.query('INSERT INTO contactos (nombre,email,mensaje) VALUES (?,?,?)',[n,e,m]);
  const {SMTP_HOST,SMTP_USER,SMTP_PASS,MAIL_FROM,MAIL_TO}=process.env;
  if(!SMTP_HOST||!SMTP_USER||!SMTP_PASS||!MAIL_FROM||!MAIL_TO){
   console.error('SMTP incompleto; contacto guardado con ID',r.insertId);
   return res.status(503).json({error:'Mensaje guardado, pero el correo no está configurado. Contactanos por otro medio.'});
  }
  const transporter=nodemailer.createTransport({
   host:SMTP_HOST,port:Number(process.env.SMTP_PORT||465),
   secure:process.env.SMTP_SECURE==='true',
   auth:{user:SMTP_USER,pass:SMTP_PASS},
   connectionTimeout:10000,greetingTimeout:10000,socketTimeout:15000
  });
  try {
   await transporter.sendMail({from:MAIL_FROM,to:MAIL_TO,replyTo:e,
    subject:'Nuevo contacto desde Bytes Informática',
    text:`Nuevo contacto #${r.insertId}\nNombre: ${n}\nEmail: ${e}\n\nMensaje:\n${m}`
   });
   return res.status(201).json({ok:true,mensaje:'Mensaje enviado correctamente.'});
  }catch(error){
   console.error('Falló SMTP, contacto guardado ID',r.insertId,error.message);
   return res.status(502).json({error:'Mensaje guardado, pero no se pudo enviar el email. Comunicate por otro medio.'});
  }
 }catch(e){next(e)}
});
module.exports=router;
