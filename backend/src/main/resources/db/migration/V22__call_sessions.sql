CREATE TABLE IF NOT EXISTS call_sessions (
    id BIGSERIAL PRIMARY KEY,
    context_type VARCHAR(30) NOT NULL,
    context_id BIGINT NOT NULL,
    mode VARCHAR(30) NOT NULL DEFAULT 'NORMAL',
    created_by BIGINT NOT NULL REFERENCES users(id),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_call_context ON call_sessions (context_type, context_id) WHERE activo = TRUE;
















