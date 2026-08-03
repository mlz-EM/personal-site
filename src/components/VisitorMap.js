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

const VisitorMap = () => {
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
