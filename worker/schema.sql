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
