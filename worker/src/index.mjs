const DEFAULT_ALLOWED_ORIGINS = [
  'https://mlz-em.github.io',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];
const MAX_LOCATION_AGE_DAYS = 365;
const MAX_LOCATIONS = 1000;
const COORDINATE_BUCKET_SIZE = 0.25;
const MAX_PATH_LENGTH = 256;
const VISITOR_KEY_PATTERN = /^[a-zA-Z0-9_-]{16,64}$/;

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

export const normalizePath = (value) => {
  const path = String(value || '/').trim();
  if (!path.startsWith('/')) return '/';
  const truncatedPath = path.slice(0, MAX_PATH_LENGTH);
  const withoutTrailingSlash = truncatedPath.replace(/\/+$/, '');
  return withoutTrailingSlash || '/';
};

export const normalizeVisitorKey = (value) => {
  const visitorKey = String(value || '').trim();
  return VISITOR_KEY_PATTERN.test(visitorKey) ? visitorKey : '';
};

const recordVisit = async (request, database, url) => {
  const latitude = Number(request.cf?.latitude);
  const longitude = Number(request.cf?.longitude);
  const country = String(request.cf?.country || '');
  const city = String(request.cf?.city || '');
  const now = new Date().toISOString();
  const path = normalizePath(url.searchParams.get('path'));
  const visitorKey = normalizeVisitorKey(url.searchParams.get('visitor'))
    || crypto.randomUUID();

  await database.prepare(`
    INSERT INTO visitor_events (path, country, city, visited_at)
    VALUES (?, ?, ?, ?)
  `).bind(path, country, city, now).run();

  await database.prepare(`
    INSERT INTO visitor_recent_visits (visitor_key, country, city, visited_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(visitor_key) DO NOTHING
  `).bind(visitorKey, country, city, now).run();

  if (
    url.searchParams.get('location') !== '1'
    || !Number.isFinite(latitude)
    || !Number.isFinite(longitude)
  ) return;

  const roundedLatitude = roundCoordinate(latitude);
  const roundedLongitude = roundCoordinate(longitude);
  const locationKey = `${country}:${roundedLatitude.toFixed(2)}:${roundedLongitude.toFixed(2)}`;

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

const listStats = async (database) => {
  const [summaryResult, legacyResult, trendResult, pathsResult, recentResult] = await Promise.all([
    database.prepare(`
      SELECT
        COUNT(*) AS all_time,
        SUM(CASE WHEN visited_at >= datetime('now', 'start of day') THEN 1 ELSE 0 END) AS today,
        SUM(CASE WHEN visited_at >= datetime('now', '-6 days', 'start of day') THEN 1 ELSE 0 END) AS seven_days,
        SUM(CASE WHEN visited_at >= datetime('now', '-29 days', 'start of day') THEN 1 ELSE 0 END) AS last_month
      FROM visitor_events
    `).first(),
    database.prepare(`
      SELECT value
      FROM visitor_stats_meta
      WHERE key = 'legacy_visit_total'
    `).first(),
    database.prepare(`
      WITH RECURSIVE dates(day) AS (
        SELECT date('now', '-89 days')
        UNION ALL
        SELECT date(day, '+1 day') FROM dates WHERE day < date('now')
      )
      SELECT dates.day AS date, COUNT(visitor_events.event_id) AS visits
      FROM dates
      LEFT JOIN visitor_events ON date(visitor_events.visited_at) = dates.day
      GROUP BY dates.day
      ORDER BY dates.day
    `).all(),
    database.prepare(`
      SELECT normalized_path AS path, COUNT(*) AS visits
      FROM (
        SELECT
          CASE
            WHEN TRIM(path, '/') = '' THEN '/'
            ELSE RTRIM(path, '/')
          END AS normalized_path
        FROM visitor_events
      )
      GROUP BY normalized_path
      ORDER BY visits DESC, path ASC
      LIMIT 3
    `).all(),
    database.prepare(`
      SELECT city, country, visited_at
      FROM visitor_recent_visits
      ORDER BY visited_at DESC, visitor_key ASC
      LIMIT 10
    `).all(),
  ]);

  const eventTotal = Number(summaryResult?.all_time) || 0;
  const legacyTotal = Number(legacyResult?.value) || 0;

  return {
    summary: {
      today: Number(summaryResult?.today) || 0,
      sevenDays: Number(summaryResult?.seven_days) || 0,
      lastMonth: Number(summaryResult?.last_month) || 0,
      allTime: legacyTotal + eventTotal,
    },
    trend: (trendResult.results || []).map((row) => ({
      date: row.date,
      visits: Number(row.visits) || 0,
    })),
    paths: (pathsResult.results || []).map((row) => ({
      path: row.path,
      visits: Number(row.visits) || 0,
    })),
    recentVisits: (recentResult.results || []).map((row) => ({
      city: row.city || 'Unknown city',
      country: row.country || 'Unknown country',
      visitedAt: row.visited_at,
    })),
  };
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

    const isVisitsRequest = url.pathname === '/visits' && ['GET', 'POST'].includes(request.method);
    const isStatsRequest = url.pathname === '/stats' && request.method === 'GET';
    if (!isVisitsRequest && !isStatsRequest) {
      return jsonResponse({ error: 'Not found' }, 404, origin, allowedOrigins);
    }

    if (origin && !allowedOrigins.includes(origin)) {
      return jsonResponse({ error: 'Origin not allowed' }, 403, origin, allowedOrigins);
    }

    try {
      if (isStatsRequest) {
        const stats = await listStats(env.DB);
        return jsonResponse(stats, 200, origin, allowedOrigins);
      }

      if (request.method === 'POST') await recordVisit(request, env.DB, url);
      const locations = await listLocations(env.DB);
      return jsonResponse({ locations }, 200, origin, allowedOrigins);
    } catch (error) {
      return jsonResponse({ error: 'Visitor data temporarily unavailable' }, 500, origin, allowedOrigins);
    }
  },
};
