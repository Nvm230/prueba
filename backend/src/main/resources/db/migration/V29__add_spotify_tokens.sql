-- Agregar campos para almacenar tokens de Spotify OAuth
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS spotify_access_token TEXT,
ADD COLUMN IF NOT EXISTS spotify_refresh_token TEXT,
ADD COLUMN IF NOT EXISTS spotify_token_expires_at BIGINT;

