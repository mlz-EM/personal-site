import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';

const loadCloudflareAnalytics = () => {
  if (navigator.userAgent === 'ReactSnap') return;

  const script = document.createElement('script');
  script.type = 'module';
  script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  script.dataset.cfBeacon = JSON.stringify({
    token: 'e7bc4077c8a24e3da46dab64543b4cc9',
  });
  document.body.appendChild(script);
};

// See https://reactjs.org/docs/strict-mode.html
const StrictApp = () => (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const rootElement = document.getElementById('root');

// hydrate is required by react-snap.
if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, <StrictApp />);
} else {
  const root = createRoot(rootElement);
  root.render(<StrictApp />);
}

loadCloudflareAnalytics();
