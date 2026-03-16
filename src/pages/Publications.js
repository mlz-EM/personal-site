import React, { useState } from 'react';
import Main from '../layouts/Main';
import scholarMetrics from '../data/scholarMetrics.json';
import PageHeader from '../components/Template/PageHeader';
import PageTools from '../components/Template/PageTools';

const formatMonthYear = (value) => {
  if (!value) return 'pending';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'pending'
    : date.toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' });
};

const Publications = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const hasCoreMetrics = Number.isInteger(scholarMetrics.citationsAll)
    && Number.isInteger(scholarMetrics.hIndexAll);
  const hasPapers = Number.isInteger(scholarMetrics.papersAll);
  const updatedLabel = formatMonthYear(scholarMetrics.updatedAt);
  const isStale = scholarMetrics.status === 'stale';

  const gsDetails = [
    hasPapers ? `Papers: ${scholarMetrics.papersAll.toLocaleString('en-US')}` : 'Papers: --',
    hasCoreMetrics ? `Citations: ${scholarMetrics.citationsAll.toLocaleString('en-US')}` : 'Citations: --',
    hasCoreMetrics ? `h-index: ${scholarMetrics.hIndexAll}` : 'h-index: --',
    hasCoreMetrics ? `${isStale ? 'stale' : 'updated'} ${updatedLabel}` : 'updating daily',
  ].join(' \u00b7 ');

  const gsText = (
    <>
      <span className="gs-stat-label">GS Stat.</span>
      <span className="gs-stat-rest">{` \u00b7 ${gsDetails}`}</span>
    </>
  );

  const bibbaseUrl = 'https://bibbase.org/show?bib=https%3A%2F%2Fpaperpile.com%2Feb%2FsFzULUUbmz&commas=true&noBootstrap=1&nocache=1&hidemenu=0&noTitleLinks=true&showSearch=true&folding=1';
  const PUBLICATION_TOOLS = [
    { label: 'Top', href: '#publications' },
    { label: 'Google Scholar', href: 'https://scholar.google.com/citations?user=tkEx8OQAAAAJ', external: true },
    { label: 'BibBase', href: bibbaseUrl, external: true },
  ];

  return (
    <Main title="Publications" description="Menglin Zhu's publications.">
      <article className="post publications-page" id="publications">
        <PageHeader
          title={(
            <>
              Publications (
              <a href="https://scholar.google.com/citations?user=tkEx8OQAAAAJ" target="_blank" rel="noopener noreferrer" className="inline-link">Google Scholar</a>
              )
            </>
          )}
          subtitle={gsText}
          subtitleClassName="publications-metrics"
        />
        <PageTools items={PUBLICATION_TOOLS} ariaLabel="Publications page tools" />

        <div className="publications-frame-wrapper">
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
            className={`publications-iframe ${loading ? 'is-hidden' : ''}`}
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
