ALTER TABLE chat_messages
    ADD COLUMN IF NOT EXISTS file_asset_id BIGINT REFERENCES file_assets(id),
    ADD COLUMN IF NOT EXISTS sticker_id BIGINT;

ALTER TABLE group_messages
    ADD COLUMN IF NOT EXISTS file_asset_id BIGINT REFERENCES file_assets(id),
    ADD COLUMN IF NOT EXISTS sticker_id BIGINT;

ALTER TABLE private_messages
    ADD COLUMN IF NOT EXISTS file_asset_id BIGINT REFERENCES file_assets(id),
    ADD COLUMN IF NOT EXISTS sticker_id BIGINT,
    ADD COLUMN IF NOT EXISTS mode VARCHAR(30);

CREATE TABLE IF NOT EXISTS stickers (
    id BIGSERIAL PRIMARY KEY,
    owner_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    file_asset_id BIGINT NOT NULL REFERENCES file_assets(id) ON DELETE CASCADE,
    nombre VARCHAR(80),
    global_flag BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stickers_owner ON stickers(owner_id);
















