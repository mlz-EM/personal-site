import React, { useEffect, useMemo, useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';
import worldGeography from 'world-atlas/countries-110m.json';

const API_URL = (process.env.REACT_APP_VISITOR_MAP_API_URL || '').replace(/\/$/, '');
const RECENT_WINDOW_MS = 3 * 24 * 60 * 60 * 1000;
const TRACKING_INTERVAL_MS = 6 * 60 * 60 * 1000;
const LAST_TRACKED_KEY = 'mlz-em-visitor-map-last-tracked';

const normalizeLocations = (locations) => (
  Array.isArray(locations)
    ? locations
      .map((location) => ({
        latitude: Number(location.latitude),
        longitude: Number(location.longitude),
        lastSeen: String(location.lastSeen || ''),
      }))
      .filter((location) => (
        Number.isFinite(location.latitude)
        && Number.isFinite(location.longitude)
      ))
    : []
);

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

const VisitorMap = () => {
  const [locations, setLocations] = useState([]);
  const loadedAt = useMemo(() => Date.now(), []);

  useEffect(() => {
    if (!API_URL || navigator.userAgent === 'ReactSnap') return undefined;

    const controller = new AbortController();
    const recordVisit = shouldRecordVisit();

    fetch(`${API_URL}/visits`, {
      method: recordVisit ? 'POST' : 'GET',
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Visitor map request failed: ${response.status}`);
        if (recordVisit) rememberVisit();
        return response.json();
      })
      .then((payload) => setLocations(normalizeLocations(payload.locations)))
      .catch((error) => {
        if (error.name !== 'AbortError') setLocations([]);
      });

    return () => controller.abort();
  }, []);

  return (
    <div className="visitor-map-widget" aria-hidden="true">
      <ComposableMap
        className="visitor-map-widget__map"
        width={160}
        height={96}
        projection="geoMercator"
        projectionConfig={{ center: [0, 42], scale: 23 }}
      >
        <Geographies geography={worldGeography}>
          {({ geographies }) => geographies
            .filter((geography) => String(geography.id) !== '010')
            .map((geography) => (
              <Geography
                key={geography.rsmKey}
                geography={geography}
                fill="#c6c6c6"
                stroke="#f4f4f4"
                strokeWidth={0.35}
                tabIndex={-1}
                style={{
                  default: { outline: 'none' },
                  hover: { fill: '#c6c6c6', outline: 'none' },
                  pressed: { fill: '#c6c6c6', outline: 'none' },
                }}
              />
            ))}
        </Geographies>
        {locations.map((location) => {
          const seenAt = Date.parse(location.lastSeen);
          const isRecent = Number.isFinite(seenAt) && loadedAt - seenAt <= RECENT_WINDOW_MS;
          const key = `${location.latitude}-${location.longitude}-${location.lastSeen}`;

          return (
            <Marker key={key} coordinates={[location.longitude, location.latitude]}>
              <circle
                r={isRecent ? 2.3 : 1.35}
                fill={isRecent ? '#000000' : '#b2b2b2'}
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
