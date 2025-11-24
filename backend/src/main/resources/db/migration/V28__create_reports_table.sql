CREATE TABLE reports (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    target_id BIGINT NOT NULL,
    reported_by_id BIGINT NOT NULL REFERENCES users(id),
    reason VARCHAR(500) NOT NULL,
    details TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewed_by_id BIGINT REFERENCES users(id),
    CONSTRAINT fk_reported_by FOREIGN KEY (reported_by_id) REFERENCES users(id),
    CONSTRAINT fk_reviewed_by FOREIGN KEY (reviewed_by_id) REFERENCES users(id)
);

CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX idx_reports_type_target ON reports(type, target_id);

