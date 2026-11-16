-- =====================================================================
-- BYTES INFORMATICA - Base de datos del integrador Next.js + Express
-- Repositorio: martinvegamercado/DiploReactIntegrador
-- Aplicacion: frontend/diplo-next
-- Motor: MySQL 8.0+ | Charset: utf8mb4
-- Ejecutar el archivo completo una sola vez desde MySQL Workbench o CLI.
-- Este script CREA la base y las 6 tablas. NO borra tablas existentes.
-- =====================================================================

CREATE DATABASE IF NOT EXISTS bytes_informatica
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bytes_informatica;

-- 1. Usuarios del panel privado
-- Generar hashes con bcrypt o argon2 desde Node.js; NO usar MD5.
CREATE TABLE IF NOT EXISTS usuarios (
  idUsuario INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  rol ENUM('admin','editor') NOT NULL DEFAULT 'editor',
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  ultimoAcceso DATETIME NULL,
  creadoEn DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizadoEn DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (idUsuario),
  UNIQUE KEY uk_usuarios_email (email),
  KEY idx_usuarios_rol_activo (rol, activo)
) ENGINE=InnoDB;

-- 2. Categorias para productos y novedades
CREATE TABLE IF NOT EXISTS categorias (
  idCategoria INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL,
  tipo ENUM('producto','novedad') NOT NULL,
  activa BOOLEAN NOT NULL DEFAULT TRUE,
  creadoEn DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (idCategoria),
  UNIQUE KEY uk_categorias_slug (slug),
  KEY idx_categorias_tipo_activa (tipo, activa)
) ENGINE=InnoDB;

-- 3. Servicios de /servicios
CREATE TABLE IF NOT EXISTS servicios (
  idServicio INT NOT NULL AUTO_INCREMENT,
  titulo VARCHAR(150) NOT NULL,
  slug VARCHAR(160) NOT NULL,
  descripcion TEXT NOT NULL,
  imagenUrl VARCHAR(500) NULL,
  ordenVisualizacion INT NOT NULL DEFAULT 0,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  creadoPor INT NULL,
  creadoEn DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizadoEn DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (idServicio),
  UNIQUE KEY uk_servicios_slug (slug),
  KEY idx_servicios_activo_orden (activo, ordenVisualizacion),
  KEY idx_servicios_creadoPor (creadoPor),
  CONSTRAINT fk_servicios_usuario FOREIGN KEY (creadoPor)
    REFERENCES usuarios (idUsuario) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- 4. Productos de /productos
-- caracteristicas almacena array JSON de textos para el MVP.
CREATE TABLE IF NOT EXISTS productos (
  idProducto INT NOT NULL AUTO_INCREMENT,
  idCategoria INT NULL,
  nombre VARCHAR(160) NOT NULL,
  slug VARCHAR(180) NOT NULL,
  subtitulo VARCHAR(240) NULL,
  descripcion TEXT NOT NULL,
  caracteristicas JSON NULL,
  imagenUrl VARCHAR(500) NULL,
  destacado BOOLEAN NOT NULL DEFAULT FALSE,
  publicado BOOLEAN NOT NULL DEFAULT TRUE,
  creadoPor INT NULL,
  creadoEn DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizadoEn DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (idProducto),
  UNIQUE KEY uk_productos_slug (slug),
  KEY idx_productos_publicado_destacado (publicado, destacado),
  KEY idx_productos_idCategoria (idCategoria),
  KEY idx_productos_creadoPor (creadoPor),
  CONSTRAINT fk_productos_categoria FOREIGN KEY (idCategoria)
    REFERENCES categorias (idCategoria) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_productos_usuario FOREIGN KEY (creadoPor)
    REFERENCES usuarios (idUsuario) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- 5. Novedades / noticias
CREATE TABLE IF NOT EXISTS novedades (
  idNovedad INT NOT NULL AUTO_INCREMENT,
  idCategoria INT NULL,
  titulo VARCHAR(200) NOT NULL,
  slug VARCHAR(220) NOT NULL,
  resumen VARCHAR(400) NULL,
  contenido LONGTEXT NOT NULL,
  imagenUrl VARCHAR(500) NULL,
  fechaPublicacion DATETIME NULL,
  estado ENUM('borrador','publicada') NOT NULL DEFAULT 'borrador',
  autorId INT NULL,
  creadoEn DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizadoEn DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (idNovedad),
  UNIQUE KEY uk_novedades_slug (slug),
  KEY idx_novedades_estado_fecha (estado, fechaPublicacion),
  KEY idx_novedades_idCategoria (idCategoria),
  KEY idx_novedades_autorId (autorId),
  CONSTRAINT fk_novedades_categoria FOREIGN KEY (idCategoria)
    REFERENCES categorias (idCategoria) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_novedades_autor FOREIGN KEY (autorId)
    REFERENCES usuarios (idUsuario) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- 6. Formulario /contacto y bandeja de atencion
CREATE TABLE IF NOT EXISTS contactos (
  idContacto INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL,
  mensaje TEXT NOT NULL,
  estado ENUM('nuevo','enProceso','respondido','archivado') NOT NULL DEFAULT 'nuevo',
  recibidoEn DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atendidoPor INT NULL,
  atendidoEn DATETIME NULL,
  notaInterna TEXT NULL,
  PRIMARY KEY (idContacto),
  KEY idx_contactos_estado_recibido (estado, recibidoEn),
  KEY idx_contactos_atendidoPor (atendidoPor),
  CONSTRAINT fk_contactos_usuario FOREIGN KEY (atendidoPor)
    REFERENCES usuarios (idUsuario) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- =====================================================================
-- DATOS INICIALES DE DEMOSTRACION (idempotentes por slug)
-- Las FK de autor son NULL porque aun no se creo un administrador.
-- =====================================================================
INSERT INTO categorias (nombre, slug, tipo) VALUES
  ('Soluciones de datos', 'soluciones-de-datos', 'producto'),
  ('Tecnologia e innovacion', 'tecnologia-e-innovacion', 'novedad')
ON DUPLICATE KEY UPDATE slug = slug;

INSERT INTO servicios (titulo, slug, descripcion, imagenUrl, ordenVisualizacion, activo) VALUES
  ('Desarrollo Front-end', 'desarrollo-front-end',
   'Disenamos y programamos interfaces de usuario interactivas, atractivas y responsivas.',
   '/img/icon-frontend.png', 1, TRUE),
  ('Desarrollo Back-end', 'desarrollo-back-end',
   'Construimos logica de negocio, APIs y arquitecturas escalables para aplicaciones.',
   '/img/icon-backend.png', 2, TRUE)
ON DUPLICATE KEY UPDATE slug = slug;

INSERT INTO productos
  (idCategoria, nombre, slug, subtitulo, descripcion, caracteristicas, destacado, publicado)
SELECT c.idCategoria, 'Bytes Insight Engine', 'bytes-insight-engine',
  'Modelo de Ciencia de Datos para Negocios',
  'Solucion de analisis predictivo para descubrir patrones, proyectar demanda y optimizar recursos.',
  JSON_ARRAY(
    'Analisis predictivo con Python',
    'Integracion con SQL Server',
    'Escalabilidad con Microsoft Fabric',
    'Dashboards y endpoints para front-end'),
  TRUE, TRUE
FROM categorias c WHERE c.slug = 'soluciones-de-datos'
ON DUPLICATE KEY UPDATE idProducto = idProducto;

INSERT INTO novedades
  (idCategoria, titulo, slug, resumen, contenido, fechaPublicacion, estado)
SELECT c.idCategoria,
  'Bytes integra inteligencia artificial en sus sistemas',
  'bytes-integra-inteligencia-artificial',
  'Avanzamos en la integracion de IA en soluciones Front-end y Back-end.',
  'Bytes incorpora herramientas de inteligencia artificial para optimizar procesos, analizar datos y mejorar la experiencia de usuario en aplicaciones modernas.',
  '2026-08-07 10:00:00', 'publicada'
FROM categorias c WHERE c.slug = 'tecnologia-e-innovacion'
ON DUPLICATE KEY UPDATE idNovedad = idNovedad;

-- =====================================================================
-- COMPROBACIONES
-- =====================================================================
SHOW TABLES;
SELECT 'usuarios' AS tabla, COUNT(*) AS registros FROM usuarios
UNION ALL SELECT 'categorias', COUNT(*) FROM categorias
UNION ALL SELECT 'servicios', COUNT(*) FROM servicios
UNION ALL SELECT 'productos', COUNT(*) FROM productos
UNION ALL SELECT 'novedades', COUNT(*) FROM novedades
UNION ALL SELECT 'contactos', COUNT(*) FROM contactos;

-- NO se inserta usuario admin con clave fija.
-- Crearlo desde un script Node.js con bcrypt/argon2 y parametros SQL.
-- Nota: la aplicacion debe verificar que categorias.tipo coincida con
-- el recurso ('producto' o 'novedad') al asignar una categoria.
