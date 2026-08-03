CREATE TABLE IF NOT EXISTS visitor_locations (
  location_key TEXT PRIMARY KEY,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  country TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  first_seen TEXT NOT NULL,
  last_seen TEXT NOT NULL,
  visits INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS visitor_locations_last_seen_idx
  ON visitor_locations (last_seen DESC);

CREATE TABLE IF NOT EXISTS visitor_events (
  event_id INTEGER PRIMARY KEY AUTOINCREMENT,
  path TEXT NOT NULL DEFAULT '/',
  country TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  visited_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS visitor_events_visited_at_idx
  ON visitor_events (visited_at DESC);

CREATE INDEX IF NOT EXISTS visitor_events_path_idx
  ON visitor_events (path);

-- This table powers only the Recent visits list. Each browser session keeps
-- one entry row while visitor_events continues to retain every page view.
CREATE TABLE IF NOT EXISTS visitor_recent_visits (
  visitor_key TEXT PRIMARY KEY,
  country TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  visited_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS visitor_recent_visits_visited_at_idx
  ON visitor_recent_visits (visited_at DESC);

CREATE TABLE IF NOT EXISTS visitor_stats_meta (
  key TEXT PRIMARY KEY,
  value INTEGER NOT NULL
);

-- Preserve the map's pre-statistics visit total as the all-time baseline.
INSERT OR IGNORE INTO visitor_stats_meta (key, value)
SELECT 'legacy_visit_total', COALESCE(SUM(visits), 0)
FROM visitor_locations;
