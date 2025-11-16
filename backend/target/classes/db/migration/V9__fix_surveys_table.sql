-- Asegurar que la columna closed existe en surveys
ALTER TABLE surveys ADD COLUMN IF NOT EXISTS closed BOOLEAN NOT NULL DEFAULT FALSE;

-- Asegurar que event_id puede ser NULL (para encuestas de grupo)
-- Si la columna existe y es NOT NULL, hacerla nullable
-- Nota: Esto puede fallar si ya es nullable, pero es seguro ignorar el error
ALTER TABLE surveys ALTER COLUMN event_id DROP NOT NULL;

