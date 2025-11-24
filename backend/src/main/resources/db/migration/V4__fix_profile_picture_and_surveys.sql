-- Fix profile_picture_url to TEXT (was VARCHAR(1000) which is too short for base64 images)
ALTER TABLE users ALTER COLUMN profile_picture_url TYPE TEXT;

-- Add closed field to surveys
ALTER TABLE surveys ADD COLUMN IF NOT EXISTS closed BOOLEAN NOT NULL DEFAULT FALSE;







