-- Hacer que el evento sea opcional en encuestas para permitir encuestas de grupo
ALTER TABLE surveys ALTER COLUMN event_id DROP NOT NULL;







