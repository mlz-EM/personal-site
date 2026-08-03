const DEFAULT_ALLOWED_ORIGINS = [
  'https://mlz-em.github.io',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];
const MAX_LOCATION_AGE_DAYS = 365;
const MAX_LOCATIONS = 1000;
const COORDINATE_BUCKET_SIZE = 0.25;

const roundCoordinate = (value) => (
  Math.round(value / COORDINATE_BUCKET_SIZE) * COORDINATE_BUCKET_SIZE
);

const responseHeaders = (origin, allowedOrigins) => ({
  'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json; charset=utf-8',
  Vary: 'Origin',
});

const jsonResponse = (payload, status, origin, allowedOrigins) => new Response(
  JSON.stringify(payload),
  {
    status,
    headers: responseHeaders(origin, allowedOrigins),
  },
);

const listLocations = async (database) => {
  const cutoff = new Date(Date.now() - MAX_LOCATION_AGE_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const result = await database.prepare(`
    SELECT latitude, longitude, country, city, first_seen, last_seen, visits
    FROM visitor_locations
    WHERE last_seen >= ?
    ORDER BY last_seen DESC
    LIMIT ?
  `).bind(cutoff, MAX_LOCATIONS).all();

  return (result.results || []).map((row) => ({
    latitude: row.latitude,
    longitude: row.longitude,
    country: row.country,
    city: row.city,
    firstSeen: row.first_seen,
    lastSeen: row.last_seen,
    visits: row.visits,
  }));
};

const recordVisit = async (request, database) => {
  const latitude = Number(request.cf?.latitude);
  const longitude = Number(request.cf?.longitude);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;

  const roundedLatitude = roundCoordinate(latitude);
  const roundedLongitude = roundCoordinate(longitude);
  const country = String(request.cf?.country || '');
  const city = String(request.cf?.city || '');
  const locationKey = `${country}:${roundedLatitude.toFixed(2)}:${roundedLongitude.toFixed(2)}`;
  const now = new Date().toISOString();

  await database.prepare(`
    INSERT INTO visitor_locations (
      location_key, latitude, longitude, country, city, first_seen, last_seen, visits
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    ON CONFLICT(location_key) DO UPDATE SET
      last_seen = excluded.last_seen,
      visits = visitor_locations.visits + 1
  `).bind(
    locationKey,
    roundedLatitude,
    roundedLongitude,
    country,
    city,
    now,
    now,
  ).run();
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const allowedOrigins = String(env.ALLOWED_ORIGINS || DEFAULT_ALLOWED_ORIGINS.join(','))
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: responseHeaders(origin, allowedOrigins),
      });
    }

    if (url.pathname !== '/visits' || !['GET', 'POST'].includes(request.method)) {
      return jsonResponse({ error: 'Not found' }, 404, origin, allowedOrigins);
    }

    if (origin && !allowedOrigins.includes(origin)) {
      return jsonResponse({ error: 'Origin not allowed' }, 403, origin, allowedOrigins);
    }

    try {
      if (request.method === 'POST') await recordVisit(request, env.DB);
      const locations = await listLocations(env.DB);
      return jsonResponse({ locations }, 200, origin, allowedOrigins);
    } catch (error) {
      return jsonResponse({ error: 'Visitor map temporarily unavailable' }, 500, origin, allowedOrigins);
    }
  },
};
