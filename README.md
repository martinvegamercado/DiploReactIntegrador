# Bytes Informática — Inicio rápido

Proyecto: `DiploReactIntegrador` (frontend Next.js + API Node/Express + MySQL).

usuario cargado admin usuario: martinvegamercado@gmail.com
password:0123456789

## Requisitos
- Node.js y npm instalados.
- MySQL encendido y base `bytes_informatica` ya creada con el script SQL.
- Dos terminales abiertas en la carpeta raíz del proyecto.

## 1. Backend y administrador inicial

En la primera terminal:

```bat
cd backend
npm install
copy .env.example .env
```

Editar `backend/.env` con el usuario y contraseña de MySQL. Si usás MySQL portable, dejar `DB_PORT=3037`; si es el puerto estándar, usar `3306`.

Generar una clave aleatoria para las sesiones:

```bat
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Copiar el resultado a `SESSION_SECRET=` dentro de `backend/.env` (no compartir esa clave).

Para el formulario de contacto, completar también `SMTP_USER`, `SMTP_PASS` (contraseña **de aplicación** de Gmail), `MAIL_FROM` y `MAIL_TO`.

Crear el primer usuario administrador (solo una vez):

```bat
npm run crear-admin
```

Ingresar los datos que pida el asistente. Luego arrancar la API:

```bat
npm run dev
```

Comprobar: http://localhost:3001/api/salud

## 2. Frontend Next.js

En otra terminal, desde la raíz del repositorio:

```bat
cd frontend
npm install
copy .env.local.example .env.local
npm run dev
```

En `frontend/.env.local` verificar:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Abrir http://localhost:3000 y seleccionar **Iniciar sesión**. Para cargar novedades, ir a http://localhost:3000/admin/novedades; para probar correo, usar http://localhost:3000/contacto.


