import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import Main from '../layouts/Main';

const Publications = () => {
  useEffect(() => {
    // Ensure the script is not added multiple times
    const existingScript = document.querySelector('script[src*="bibbase.org"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://bibbase.org/show?bib=https%3A%2F%2Fpaperpile.com%2Feb%2FcChVXXjwmu&commas=false&noBootstrap=1&jsonp=1&owner=zhu&showSearch=true';
      script.async = true;

      // Append script directly to the document body
      document.body.appendChild(script);
    }

    // Cleanup function to remove the script if needed
    return () => {
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <Main title="Publications" description="List of publications.">
      <article className="post" id="publications">
        <header>
          <div className="title">
            <h2><Link to="/publications">Publications</Link></h2>
          </div>
        </header>

        {/* Bibliography Section */}
        <section>
          {/* This iframe is a backup option in case script injection fails */}
          <iframe
            src="https://bibbase.org/show?bib=https%3A%2F%2Fpaperpile.com%2Feb%2FcChVXXjwmu&commas=false&noBootstrap=1&showSearch=true"
            width="100%"
            height="500px"
            style={{ border: 'none' }}
            title="BibBase Publications"
          />
        </section>
      </article>
    </Main>
  );
};

export default Publications;
