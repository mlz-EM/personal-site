import React, { useEffect, useRef } from 'react';

const SCRIPT_SRC = 'https://mapmyvisitors.com/map.js?cl=c6c6c6&w=a&t=n&d=iu2Si63h6GRArax3gDdPSOYq6mNwTGnYuNlENh-Ndw8&co=f4f4f4&ct=7d7d7d&cmo=b2b2b2&cmn=000000';

const MapMyVisitors = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    if (typeof navigator !== 'undefined' && navigator.userAgent === 'ReactSnap') {
      return undefined;
    }

    if (container.querySelector('#mapmyvisitors')) return undefined;

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.id = 'mapmyvisitors';
    script.src = SCRIPT_SRC;
    container.appendChild(script);

    return () => {
      if (container.contains(script)) {
        container.removeChild(script);
      }
    };
  }, []);

  return <div className="mapmyvisitors-widget" ref={containerRef} aria-hidden="true" />;
};

export default MapMyVisitors;
