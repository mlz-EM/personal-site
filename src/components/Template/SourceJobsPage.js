import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
import Main from '../../layouts/Main';
import PageHeader from './PageHeader';
import PageTools from './PageTools';
import FeedBasicInfo from './FeedBasicInfo';
import { getDateInputValueDaysAgo } from '../../utils/dateInput';

const getDefaultWindowDate = () => getDateInputValueDaysAgo(30);

const SourceJobsPage = ({
  description,
  emptySourceLabel,
  feedLoader,
  pageTitle,
  routeKey,
}) => {
  const feed = useMemo(() => feedLoader(), [feedLoader]);
  const [filterDate, setFilterDate] = useState(getDefaultWindowDate);
  const [minStars, setMinStars] = useState(1);
  const [onlyNew, setOnlyNew] = useState(true);
  const [selectedSource, setSelectedSource] = useState('all');
  const topId = `${routeKey}-jobs`;
  const filterId = `${routeKey}-job-filters`;
  const tools = [
    { label: 'Top', href: `#${topId}` },
    { label: 'Filters', href: `#${filterId}` },
    { label: 'TTAP', to: '/job' },
  ];

  const filteredJobs = feed.items.filter((job) => {
    const dateMatch = !filterDate || new Date(job.date) >= new Date(filterDate);
    const starsMatch = (job.metadata.stars || 0) >= minStars;
    const newMatch = !onlyNew || Boolean(job.metadata.isNew);
    const sourceMatch = selectedSource === 'all' || job.source === selectedSource;
    return dateMatch && starsMatch && newMatch && sourceMatch;
  });

  return (
    <Main title={pageTitle} description={description}>
      <article className="post markdown" id={topId}>
        <PageHeader title={feed.source || emptySourceLabel} />
        <PageTools items={tools} ariaLabel={`${emptySourceLabel} page tools`} />
        <FeedBasicInfo header={feed.header} />
        <div className="filter-section job-filter-row" id={filterId}>
          <div className="jobs-filter-new">
            <label htmlFor={`${routeKey}-only-new`} className="job-filter-label">
              NEW
              <input
                id={`${routeKey}-only-new`}
                type="checkbox"
                checked={onlyNew}
                onChange={(event) => setOnlyNew(event.target.checked)}
              />
            </label>
          </div>
          <label htmlFor={`${routeKey}-filter-date`} className="job-filter-label">
            After
            <input
              id={`${routeKey}-filter-date`}
              type="date"
              value={filterDate}
              onChange={(event) => setFilterDate(event.target.value)}
              className="job-filter-input"
            />
          </label>
          <label htmlFor={`${routeKey}-min-stars`} className="job-filter-label">
            Fit
            <select
              id={`${routeKey}-min-stars`}
              value={minStars}
              onChange={(event) => {
                const next = parseInt(event.target.value, 10);
                setMinStars(Number.isNaN(next) ? 1 : next);
              }}
              className="job-filter-select"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
          </label>
          <label htmlFor={`${routeKey}-source`} className="job-filter-label">
            Source
            <select
              id={`${routeKey}-source`}
              value={selectedSource}
              onChange={(event) => setSelectedSource(event.target.value)}
              className="job-filter-select"
            >
              <option value="all">All</option>
              {(Array.isArray(feed.sources) ? feed.sources : []).map((source) => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => {
              setFilterDate(getDefaultWindowDate());
              setMinStars(1);
              setOnlyNew(false);
              setSelectedSource('all');
            }}
            className="job-filter-clear"
          >
            Clear
          </button>
        </div>
        <hr />
        <div className="jobs-list">
          {filteredJobs.length === 0 ? (
            <p>No {emptySourceLabel} jobs match the selected filters.</p>
          ) : filteredJobs.map((job) => (
            <div key={job.url} className="job-item">
              <p>
                <a href={job.url} target="_blank" rel="noopener noreferrer">
                  <strong>{job.metadata.isNew ? '[NEW] ' : ''}{job.title}</strong>
                </a>
                {' 🌟'.repeat(job.metadata.stars || 0)}
              </p>
              <p><strong>Location:</strong> {job.metadata.location}</p>
              <p><strong>Source:</strong> {job.source}</p>
              <p><strong>Date:</strong> {job.date}</p>
              <p>
                <strong>Description:</strong>{' '}
                {job.metadata.description || 'N/A'}
              </p>
              <hr />
            </div>
          ))}
        </div>
      </article>
    </Main>
  );
};

SourceJobsPage.propTypes = {
  description: PropTypes.string.isRequired,
  emptySourceLabel: PropTypes.string.isRequired,
  feedLoader: PropTypes.func.isRequired,
  pageTitle: PropTypes.string.isRequired,
  routeKey: PropTypes.string.isRequired,
};

export default SourceJobsPage;
