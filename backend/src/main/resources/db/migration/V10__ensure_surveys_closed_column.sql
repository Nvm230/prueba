-- Asegurar que la columna closed existe en surveys con un valor por defecto
-- Esta migración es idempotente y puede ejecutarse múltiples veces sin problemas
DO $$
BEGIN
    -- Verificar si la columna closed existe
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'surveys' 
        AND column_name = 'closed'
    ) THEN
        -- Agregar la columna si no existe
        ALTER TABLE surveys ADD COLUMN closed BOOLEAN NOT NULL DEFAULT FALSE;
    ELSE
        -- Si existe, asegurar que tenga el valor por defecto correcto
        ALTER TABLE surveys ALTER COLUMN closed SET DEFAULT FALSE;
        -- Asegurar que los valores NULL sean FALSE
        UPDATE surveys SET closed = FALSE WHERE closed IS NULL;
        ALTER TABLE surveys ALTER COLUMN closed SET NOT NULL;
    END IF;
END $$;

-- Asegurar que event_id puede ser NULL (para encuestas de grupo)
-- Solo intentar si la columna es NOT NULL
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'surveys' 
        AND column_name = 'event_id' 
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE surveys ALTER COLUMN event_id DROP NOT NULL;
    END IF;
END $$;







