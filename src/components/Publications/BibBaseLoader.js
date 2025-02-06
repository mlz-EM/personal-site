// components/Publications/BibBaseLoader.js
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const BibBaseLoader = ({ bibUrl }) => {
  const ref = useRef(null);

  useEffect(() => {
    (async () => {
      const resp = await fetch(
        'https://bibbase.org/show?bib=https%3A%2F%2Fpaperpile.com%2Feb%2FcChVXXjwmu',
        { mode: 'no-cors' },
      );
      const data = await resp.text();
      ref.innerHTML = data;
    })();
    return () => {
      // document.body.removeChild(ref);
    };
  }, [bibUrl]);

  return <div id="bibbase-container" ref={ref} />;
};

// Prop validation
BibBaseLoader.propTypes = {
  bibUrl: PropTypes.string.isRequired,
};

export default BibBaseLoader;
