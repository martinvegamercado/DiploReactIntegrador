require('dotenv').config();
const readline = require('readline');
const bcrypt = require('bcryptjs');
const db = require('../src/db');
const rl=readline.createInterface({input:process.stdin,output:process.stdout});
const ask=q=>new Promise(resolve=>rl.question(q,resolve));
(async()=>{
 try {
  const nombre=(await ask('Nombre del administrador: ')).trim();
  const email=(await ask('Email: ')).trim().toLowerCase();
  // Esta entrada se ve en la consola; ejecutá el script en una terminal privada.
  const password=await ask('Contraseña (mínimo 10 caracteres): ');
  if(!nombre || nombre.length>100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length<10 || password.length>72) throw new Error('Datos inválidos');
  const [exist]=await db.execute('SELECT idUsuario FROM usuarios WHERE email=?',[email]);
  if(exist.length) throw new Error('Ya existe un usuario con ese email');
  const hash=await bcrypt.hash(password,12);
  await db.execute("INSERT INTO usuarios(nombre,email,passwordHash,rol,activo) VALUES(?,?,?,'admin',1)",[nombre,email,hash]);
  console.log('Administrador creado correctamente.');
 } catch(e){console.error(e.message);process.exitCode=1}
 finally {rl.close(); await db.end()}
})();
