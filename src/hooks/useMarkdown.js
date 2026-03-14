import { useEffect, useState } from 'react';
import loadMarkdown from '../utils/loadMarkdown';

const useMarkdown = (importer) => {
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;

    setLoading(true);
    setError(null);

    loadMarkdown(importer, { signal: controller.signal })
      .then((content) => {
        if (!mounted) return;
        setMarkdown(content);
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted || controller.signal.aborted) return;
        setError(err);
        setLoading(false);
      });

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [importer]);

  return { markdown, loading, error };
};

export default useMarkdown;
