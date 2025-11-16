-- Agregar columna para controlar visibilidad del usuario
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_visible BOOLEAN NOT NULL DEFAULT TRUE;







