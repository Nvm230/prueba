-- Agregar columna members_can_chat si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'groups' AND column_name = 'members_can_chat'
    ) THEN
        ALTER TABLE groups ADD COLUMN members_can_chat BOOLEAN NOT NULL DEFAULT false;
    END IF;
END $$;

