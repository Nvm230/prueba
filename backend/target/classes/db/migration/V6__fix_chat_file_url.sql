-- Fix file_url column to TEXT for large base64 images
ALTER TABLE chat_messages ALTER COLUMN file_url TYPE TEXT;







