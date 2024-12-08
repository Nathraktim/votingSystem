CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    answer TEXT NOT NULL,
    form_id VARCHAR(255) NOT NULL,
    submitted_at TIMESTAMP DEFAULT NOW()
);