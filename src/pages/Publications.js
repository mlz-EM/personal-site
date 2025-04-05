import React, { useState } from 'react';
import Main from '../layouts/Main';

const Publications = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const bibbaseUrl = 'https://bibbase.org/show?bib=https%3A%2F%2Fpaperpile.com%2Feb%2FsFzULUUbmz&commas=true&noBootstrap=1&nocache=1&hidemenu=0&noTitleLinks=true&showSearch=true&folding=1';

  return (
    <Main title="Publications" description="Menglin Zhu's publications.">
      <article
        className="post"
        id="publications"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 300px)',
          overflow: 'hidden',
        }}
      >
        <header>
          <div className="title">
            <h2 style={{ marginBottom: '15px' }}>
              Publications (<a href="https://scholar.google.com/citations?user=tkEx8OQAAAAJ" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', borderBottom: '1px dashed' }}>Google Scholar</a>)
            </h2>
          </div>
        </header>

        <div style={{
          flex: 1,
          position: 'relative',
          marginTop: '-20px',
        }}
        >
          {loading && !error && (
            <div className="loading-state">
              <p>Loading publications...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <p>Failed to load publications.</p>
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
              height: '100%',
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
