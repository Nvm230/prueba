-- Add max_capacity column to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS max_capacity INTEGER;

-- Add comment
COMMENT ON COLUMN events.max_capacity IS 'Maximum number of participants allowed. NULL means unlimited.';



