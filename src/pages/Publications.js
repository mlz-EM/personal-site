import React, { useState } from 'react';
import Main from '../layouts/Main';

const Publications = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const bibbaseUrl = 'https://bibbase.org/show?bib=https%3A%2F%2Fpaperpile.com%2Feb%2FcChVXXjwmu&commas=true&noBootstrap=1';

  return (
    <Main title="Publications" description="Menglin Zhu's publications.">
      <article className="post" id="publications">
        <header>
          <div className="title">
            <h2>Publications</h2>
          </div>
        </header>
        <div style={{ minHeight: '100vh', position: 'relative' }}>
          {loading && !error && (
            <div className="loading-state">
              <p>Loading publications...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <p>Failed to load publications. </p>
              <a href={bibbaseUrl} target="_blank" rel="noreferrer">
                View publications directly
              </a>
            </div>
          )}

          <iframe
            title="bibbase-publications"
            src={bibbaseUrl}
            style={{
              width: '100%',
              height: '100vh',
              border: 'none',
              visibility: loading ? 'hidden' : 'visible',
            }}
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
          />
        </div>
      </article>
    </Main>
  );
};

export default Publications;
