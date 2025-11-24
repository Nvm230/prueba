CREATE TABLE IF NOT EXISTS file_assets (
    id BIGSERIAL PRIMARY KEY,
    uploader_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    content_type VARCHAR(120) NOT NULL,
    size_in_bytes BIGINT NOT NULL,
    scope VARCHAR(50),
    scope_id BIGINT,
    is_sticker BOOLEAN NOT NULL DEFAULT FALSE,
    preview_base64 TEXT,
    data BYTEA NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_file_assets_scope ON file_assets (scope, scope_id);
















