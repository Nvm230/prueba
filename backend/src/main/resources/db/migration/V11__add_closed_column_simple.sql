-- Migración simple para agregar la columna closed si no existe
-- Esta es una versión más simple que no usa DO blocks
ALTER TABLE surveys ADD COLUMN IF NOT EXISTS closed BOOLEAN NOT NULL DEFAULT FALSE;

-- Hacer event_id nullable si aún no lo es
-- Esto puede fallar si ya es nullable, pero es seguro ignorar el error
ALTER TABLE surveys ALTER COLUMN event_id DROP NOT NULL;







