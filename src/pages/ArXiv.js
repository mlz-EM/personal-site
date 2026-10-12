import React, { useMemo } from 'react';
import Main from '../layouts/Main';
import PageHeader from '../components/Template/PageHeader';
import PageTools from '../components/Template/PageTools';
import FeedBasicInfo from '../components/Template/FeedBasicInfo';
import getArxivFeed from '../content/arxivFeed';
import useFeedFilters from '../hooks/useFeedFilters';
import FeedFilters from '../components/Template/FeedFilters';

const ARXIV_TOOLS = [
  { label: 'Top', href: '#arxiv' },
  { label: 'Filters', href: '#arxiv-filters' },
  { label: 'Jobs', to: '/job' },
  { label: 'Resources', to: '/resources' },
];

const ArXiv = () => {
  const feed = useMemo(() => getArxivFeed(), []);
  const basicInfoHeader = useMemo(() => {
    if (!feed.header) return null;
    const notes = Array.isArray(feed.header.notes)
      ? feed.header.notes.map((note) => note.replace(
        /most recent\s+\d+\s+arXiv papers/i,
        'recent arXiv papers',
      ))
      : [];
    return {
      ...feed.header,
      notes,
    };
  }, [feed.header]);
  const filters = useFeedFilters(feed.items);

  return (
    <Main title="arXiv" description="arXiv Daily Feed">
      <article className="post markdown" id="arxiv">
        <PageHeader title="arXiv Daily Feed" />
        <PageTools items={ARXIV_TOOLS} ariaLabel="arXiv page tools" />
        <FeedBasicInfo header={basicInfoHeader} />
        <FeedFilters filters={filters} id="arxiv-filters" idPrefix="arxiv-" />
        <hr />
        <div className="jobs-list">
          {filters.filteredItems.map((item) => (
            <div key={item.metadata.id || item.url} className="job-item">
              <p>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  <strong>{item.metadata.isNew ? '[NEW] ' : ''}{item.title}</strong>
                </a>
              </p>
              <p><strong>Date:</strong> {item.date}</p>
              <p>
                <strong>Finding:</strong>{' '}
                {item.metadata.summary}
              </p>
              <hr />
            </div>
          ))}
        </div>
      </article>
    </Main>
  );
};

export default ArXiv;
