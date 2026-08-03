import React, { useMemo, useState } from 'react';
import Main from '../layouts/Main';
import PageHeader from '../components/Template/PageHeader';
import PageTools from '../components/Template/PageTools';
import FeedBasicInfo from '../components/Template/FeedBasicInfo';
import { getArxivFeed } from '../content/api';
import { getDateInputValueDaysAgo } from '../utils/dateInput';

const ARXIV_TOOLS = [
  { label: 'Top', href: '#arxiv' },
  { label: 'Filters', href: '#arxiv-filters' },
  { label: 'Jobs', to: '/job' },
  { label: 'Resources', to: '/resources' },
];
const getDefaultWindowDate = () => getDateInputValueDaysAgo(30);

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
  const [filterDate, setFilterDate] = useState(getDefaultWindowDate);
  const [onlyNew, setOnlyNew] = useState(true);

  const filteredItems = feed.items.filter((item) => {
    const dateMatch = !filterDate || new Date(item.date) >= new Date(filterDate);
    const newMatch = !onlyNew || Boolean(item.metadata.isNew);
    return dateMatch && newMatch;
  });

  const clearFilters = () => {
    setOnlyNew(false);
    setFilterDate(getDefaultWindowDate());
  };

  return (
    <Main title="arXiv" description="arXiv Daily Feed">
      <article className="post markdown" id="arxiv">
        <PageHeader title="arXiv Daily Feed" />
        <PageTools items={ARXIV_TOOLS} ariaLabel="arXiv page tools" />
        <FeedBasicInfo header={basicInfoHeader} />
        <div className="filter-section job-filter-row" id="arxiv-filters">
          <div className="jobs-filter-new">
            <label htmlFor="arxiv-only-new" className="job-filter-label">
              NEW
              <input
                id="arxiv-only-new"
                type="checkbox"
                checked={onlyNew}
                onChange={(e) => setOnlyNew(e.target.checked)}
              />
            </label>
          </div>
          <label htmlFor="arxiv-filter-date" className="job-filter-label">
            After
            <input
              id="arxiv-filter-date"
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="job-filter-input"
            />
          </label>
          <button
            type="button"
            onClick={clearFilters}
            className="job-filter-clear"
          >
            Clear
          </button>
        </div>
        <hr />
        <div className="jobs-list">
          {filteredItems.map((item) => (
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
