import React, { useEffect } from 'react';

const Publications = () => {
  useEffect(() => {
    // Create a new script element
    const script = document.createElement('script');
    script.src = 'https://bibbase.org/show?bib=https%3A%2F%2Fpaperpile.com%2Feb%2FzPzVarTdyN%2Fpaperpile.bib&commas=true&noBootstrap=1&jsonp=1';
    script.async = true;

    // Append the script to the body or head of the document
    document.body.appendChild(script);

    // Cleanup the script when the component is unmounted
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <h2>Publications</h2>
      <div id="bibbase"></div> {/* This will be populated by the script */}
    </div>
  );
};

export default Publications;
