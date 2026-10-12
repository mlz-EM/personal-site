import { useEffect, useState } from 'react';
import VISITOR_API_URL from '../config/visitorApi';
import { EMPTY_STATS, normalizeStats } from '../content/visitorStats';

const useVisitorStats = () => {
  const [stats, setStats] = useState(EMPTY_STATS);

  useEffect(() => {
    if (!VISITOR_API_URL || navigator.userAgent === 'ReactSnap') return undefined;

    const controller = new AbortController();
    fetch(`${VISITOR_API_URL}/stats`, {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Visitor statistics request failed: ${response.status}`);
        return response.json();
      })
      .then((payload) => setStats(normalizeStats(payload)))
      .catch(() => {
        // Keep zeroed statistics when the live endpoint is unavailable.
      });

    return () => controller.abort();
  }, []);

  return stats;
};

export default useVisitorStats;
