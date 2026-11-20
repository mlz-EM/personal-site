import React from 'react';
import Main from '../layouts/Main';
import scholarMetrics from '../data/scholarMetrics.json';
import PublicationArchive from '../components/Publications/PublicationArchive';

const formatMonthYear = (value) => {
  if (!value) return 'pending';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'pending'
    : date.toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' });
};

const Publications = () => {
  const hasCoreMetrics = Number.isInteger(scholarMetrics.citationsAll)
    && Number.isInteger(scholarMetrics.hIndexAll);
  const updatedLabel = formatMonthYear(scholarMetrics.updatedAt);
  const isStale = scholarMetrics.status === 'stale';

  const gsDetails = [
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

  return (
    <Main title="Publications" description="Menglin Zhu's publications." wrapperClassName="publications-layout">
      <article className="post listing-page publications-page" id="publications">
        <PublicationArchive
          title={(
            <>
              Publications (
              <a href="https://scholar.google.com/citations?user=tkEx8OQAAAAJ" target="_blank" rel="noopener noreferrer" className="inline-link">Google Scholar</a>
              )
            </>
          )}
          subtitle={gsText}
        />
      </article>
    </Main>
  );
};

export default Publications;
