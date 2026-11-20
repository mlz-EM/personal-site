import React, { useMemo } from 'react';
import Main from '../layouts/Main';
import PageHeader from '../components/Template/PageHeader';
import PageTools from '../components/Template/PageTools';
import FeedBasicInfo from '../components/Template/FeedBasicInfo';
import EmptyFeedMessage from '../components/Template/EmptyFeedMessage';
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
    <Main title="arXiv" description="arXiv Daily Feed" wrapperClassName="feed-layout">
      <article className="post listing-page feed-page" id="arxiv">
        <PageHeader title="arXiv Daily Feed" />
        <PageTools items={ARXIV_TOOLS} ariaLabel="arXiv page tools" />
        <FeedBasicInfo header={basicInfoHeader} />
        <FeedFilters filters={filters} id="arxiv-filters" idPrefix="arxiv-" />
        <hr />
        {filters.filteredItems.length === 0 ? (
          <EmptyFeedMessage>No arXiv papers match the selected filters.</EmptyFeedMessage>
        ) : (
          <ul className="listing-list">
            {filters.filteredItems.map((item) => (
              <li key={item.metadata.id || item.url} className="listing-entry">
                <h3 className="listing-title">
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.metadata.isNew ? '[NEW] ' : ''}{item.title}
                  </a>
                </h3>
                <p><strong>Date:</strong> <time dateTime={item.date}>{item.date}</time></p>
                <p>
                  <strong>Finding:</strong>{' '}
                  {item.metadata.summary}
                </p>
              </li>
            ))}
          </ul>
        )}
      </article>
    </Main>
  );
};

export default ArXiv;
