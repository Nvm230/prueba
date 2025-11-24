-- Script SQL manual para arreglar la tabla surveys
-- Ejecuta este script directamente en tu base de datos PostgreSQL si la migración no funciona

-- Agregar columna closed si no existe
ALTER TABLE surveys ADD COLUMN IF NOT EXISTS closed BOOLEAN NOT NULL DEFAULT FALSE;

-- Hacer event_id nullable (para encuestas de grupo)
ALTER TABLE surveys ALTER COLUMN event_id DROP NOT NULL;

-- Verificar que la columna se creó correctamente
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'surveys' AND column_name = 'closed';







