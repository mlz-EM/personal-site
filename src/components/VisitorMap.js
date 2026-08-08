import React, { useEffect, useMemo, useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';
import { geoProjection } from 'd3-geo';
import { alpha2ToNumeric } from 'i18n-iso-countries';
import worldGeography from 'world-atlas/countries-110m.json';

const API_URL = (process.env.REACT_APP_VISITOR_MAP_API_URL || '').replace(/\/$/, '');
const TODAY_WINDOW_MS = 24 * 60 * 60 * 1000;
const TRACKING_INTERVAL_MS = 6 * 60 * 60 * 1000;
const LAST_TRACKED_KEY = 'mlz-em-visitor-map-last-tracked';
const VISIT_SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const VISIT_SESSION_STORAGE_KEY = 'mlz-em-visit-session';
const VISITOR_KEY_PATTERN = /^[a-zA-Z0-9_-]{16,64}$/;
const MAP_WIDTH = 160;
const MAP_HEIGHT = 88;
const LIGHTEST_LAND_SHADE = 213;
const DARKEST_LAND_SHADE = 170;

const millerRaw = (longitude, latitude) => [
  longitude,
  1.25 * Math.log(Math.tan(Math.PI / 4 + 0.4 * latitude)),
];

const millerProjection = geoProjection(millerRaw)
  .center([0, 16])
  .scale(23)
  .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]);

const normalizeLocations = (locations) => (
  Array.isArray(locations)
    ? locations
      .map((location) => ({
        latitude: Number(location.latitude),
        longitude: Number(location.longitude),
        country: alpha2ToNumeric(String(location.country || '').toUpperCase()) || '',
        lastSeen: String(location.lastSeen || ''),
        visits: Math.max(0, Number(location.visits) || 0),
      }))
      .filter((location) => (
        Number.isFinite(location.latitude)
        && Number.isFinite(location.longitude)
      ))
    : []
);

const shadeForVisitCount = (visits, maximumVisits) => {
  const intensity = maximumVisits > 0 ? visits / maximumVisits : 0;
  const shade = Math.round(
    LIGHTEST_LAND_SHADE
    + (DARKEST_LAND_SHADE - LIGHTEST_LAND_SHADE) * intensity,
  );
  return `rgb(${shade}, ${shade}, ${shade})`;
};

const shouldRecordVisit = () => {
  try {
    const lastTracked = Number(window.localStorage.getItem(LAST_TRACKED_KEY));
    return !Number.isFinite(lastTracked) || Date.now() - lastTracked > TRACKING_INTERVAL_MS;
  } catch (error) {
    return true;
  }
};

const rememberVisit = () => {
  try {
    window.localStorage.setItem(LAST_TRACKED_KEY, String(Date.now()));
  } catch (error) {
    // Tracking still works when localStorage is unavailable.
  }
};

const createVisitorKey = () => {
  try {
    if (typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }

    const bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
  }
};

const createOrReuseVisitSession = (now) => {
  try {
    const storedSession = JSON.parse(
      window.localStorage.getItem(VISIT_SESSION_STORAGE_KEY) || 'null',
    );
    const storedKey = String(storedSession?.key || '');
    const lastActivityAt = Number(storedSession?.lastActivityAt);
    const sessionIsActive = VISITOR_KEY_PATTERN.test(storedKey)
      && Number.isFinite(lastActivityAt)
      && now >= lastActivityAt
      && now - lastActivityAt < VISIT_SESSION_TIMEOUT_MS;

    if (sessionIsActive) {
      window.localStorage.setItem(VISIT_SESSION_STORAGE_KEY, JSON.stringify({
        key: storedKey,
        lastActivityAt: now,
      }));
      return storedKey;
    }

    const sessionKey = createVisitorKey();
    window.localStorage.setItem(VISIT_SESSION_STORAGE_KEY, JSON.stringify({
      key: sessionKey,
      lastActivityAt: now,
    }));
    return sessionKey;
  } catch (error) {
    return '';
  }
};

export const getVisitSessionKey = (now = Date.now()) => {
  const createOrReuse = () => createOrReuseVisitSession(now);

  try {
    if (navigator.locks && typeof navigator.locks.request === 'function') {
      return navigator.locks.request(VISIT_SESSION_STORAGE_KEY, createOrReuse)
        .catch(createOrReuse);
    }
  } catch (error) {
    // Fall through when the browser does not expose a usable Web Locks API.
  }

  return Promise.resolve(createOrReuse());
};

const VisitorMap = () => {
  const [mapReady, setMapReady] = useState(false);
  const [locations, setLocations] = useState([]);
  const loadedAt = useMemo(() => Date.now(), []);
  const visitsByCountry = useMemo(() => locations.reduce((counts, location) => {
    if (!location.country) return counts;
    counts.set(location.country, (counts.get(location.country) || 0) + location.visits);
    return counts;
  }, new Map()), [locations]);
  const maximumCountryVisits = useMemo(
    () => Math.max(0, ...visitsByCountry.values()),
    [visitsByCountry],
  );

  useEffect(() => {
    if (navigator.userAgent === 'ReactSnap') return undefined;

    setMapReady(true);
    if (!API_URL) return undefined;

    const controller = new AbortController();
    const recordLocation = shouldRecordVisit();
    const isStatsPage = window.location.pathname.endsWith('/stats');
    const loadLocations = async () => {
      try {
        const visitSessionKey = await getVisitSessionKey();
        if (controller.signal.aborted) return;

        const query = new URLSearchParams({
          path: window.location.pathname,
          location: recordLocation ? '1' : '0',
        });
        if (visitSessionKey) query.set('visitor', visitSessionKey);

        const response = await fetch(`${API_URL}/visits?${query.toString()}`, {
          method: isStatsPage ? 'GET' : 'POST',
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Visitor map request failed: ${response.status}`);
        if (!isStatsPage && recordLocation) rememberVisit();

        const payload = await response.json();
        setLocations(normalizeLocations(payload.locations));
      } catch (error) {
        if (error.name !== 'AbortError') setLocations([]);
      }
    };

    loadLocations();

    return () => controller.abort();
  }, []);

  if (!mapReady) {
    return (
      <div className="visitor-map-widget" aria-hidden="true">
        <svg
          className="visitor-map-widget__map"
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          focusable="false"
          role="presentation"
        />
      </div>
    );
  }

  return (
    <div className="visitor-map-widget" aria-hidden="true">
      <ComposableMap
        className="visitor-map-widget__map"
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        projection={millerProjection}
      >
        <Geographies geography={worldGeography}>
          {({ geographies }) => geographies
            .filter((geography) => String(geography.id) !== '010')
            .map((geography) => {
              const countryId = String(geography.id).padStart(3, '0');
              const fill = shadeForVisitCount(
                visitsByCountry.get(countryId) || 0,
                maximumCountryVisits,
              );

              return (
                <Geography
                  key={geography.rsmKey}
                  geography={geography}
                  fill={fill}
                  stroke="#f4f4f4"
                  strokeWidth={0.35}
                  tabIndex={-1}
                  style={{
                    default: { outline: 'none' },
                    hover: { fill, outline: 'none' },
                    pressed: { fill, outline: 'none' },
                  }}
                />
              );
            })}
        </Geographies>
        {locations.filter((location) => {
          const seenAt = Date.parse(location.lastSeen);
          return Number.isFinite(seenAt) && loadedAt - seenAt <= TODAY_WINDOW_MS;
        }).map((location) => {
          const key = `${location.latitude}-${location.longitude}-${location.lastSeen}`;

          return (
            <Marker key={key} coordinates={[location.longitude, location.latitude]}>
              <circle
                r={2.3}
                fill="#000000"
                stroke="#f4f4f4"
                strokeWidth={0.25}
              />
            </Marker>
          );
        })}
      </ComposableMap>
    </div>
  );
};

export default VisitorMap;
