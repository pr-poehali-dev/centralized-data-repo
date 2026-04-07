CREATE TABLE t_p39568537_centralized_data_rep.site_visits (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(64) NOT NULL,
  visited_at TIMESTAMP NOT NULL DEFAULT NOW(),
  time_on_site INTEGER,
  user_agent TEXT,
  referrer TEXT
);
