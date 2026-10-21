-- La base de registros de tu página (Cloudflare D1). Se puede aplicar las veces que quieras: no borra nada.
--   npx wrangler d1 execute <nombre-de-tu-base> --remote --file schema.sql

-- Cada persona que llena el formulario.
CREATE TABLE IF NOT EXISTS registros (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  creado TEXT NOT NULL,              -- fecha y hora en UTC (ISO 8601)
  pagina TEXT,
  nombre TEXT,
  correo TEXT,
  whatsapp TEXT,
  telefono TEXT,
  ciudad TEXT,
  empresa TEXT,
  fuente TEXT,                       -- de dónde vino: la utm_source, el sitio que la mandó o «directo»
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  fbclid TEXT,
  gclid TEXT,
  utm_extra TEXT,                    -- el resto de parámetros de campaña (JSON)
  url TEXT,
  referencia TEXT,
  pais TEXT,
  ip TEXT,                           -- huella de la IP (nunca la IP): solo sirve para frenar abusos
  event_id TEXT UNIQUE,              -- el mismo id que manda el píxel de Meta (así no se duplica)
  prueba INTEGER NOT NULL DEFAULT 0  -- 1 = registro de prueba de la skill (se borra solo)
);
CREATE INDEX IF NOT EXISTS registros_creado ON registros (creado);
CREATE INDEX IF NOT EXISTS registros_ip ON registros (ip, creado);

-- Visitas por día, por página (principal o gracias) y por fuente.
CREATE TABLE IF NOT EXISTS visitas (
  dia TEXT NOT NULL,
  tipo TEXT NOT NULL,
  fuente TEXT NOT NULL,
  n INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (dia, tipo, fuente)
);
