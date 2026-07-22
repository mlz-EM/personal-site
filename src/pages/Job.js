import React, { useMemo, useState } from 'react';
import Main from '../layouts/Main';
import PageHeader from '../components/Template/PageHeader';
import PageTools from '../components/Template/PageTools';
import FeedBasicInfo from '../components/Template/FeedBasicInfo';
import { getJobsFeed } from '../content/api';
import { getDateInputValueDaysAgo } from '../utils/dateInput';

const JOB_TOOLS = [
  { label: 'Top', href: '#jobs' },
  { label: 'Filters', href: '#job-filters' },
  { label: 'arXiv', to: '/arxiv' },
];
const getDefaultWindowDate = () => getDateInputValueDaysAgo(30);

const Job = () => {
  const feed = useMemo(() => getJobsFeed(), []);
  const [filterDate, setFilterDate] = useState(getDefaultWindowDate);
  const [minStars, setMinStars] = useState(1);
  const [onlyNew, setOnlyNew] = useState(true);

  const filteredJobs = feed.items.filter((job) => {
    const dateMatch = !filterDate || new Date(job.date) >= new Date(filterDate);
    const starsMatch = (job.metadata.stars || 0) >= minStars;
    const newMatch = !onlyNew || Boolean(job.metadata.isNew);
    return dateMatch && starsMatch && newMatch;
  });

  return (
    <Main title="Jobs" description="Jobs Daily Feed">
      <article className="post markdown" id="jobs">
        <PageHeader title={feed.source || 'TTAP Daily Feed'} />
        <PageTools items={JOB_TOOLS} ariaLabel="Job page tools" />
        <FeedBasicInfo header={feed.header} />
        <div className="filter-section job-filter-row" id="job-filters">
          <div className="jobs-filter-new">
            <label htmlFor="only-new" className="job-filter-label">
              NEW
              <input
                id="only-new"
                type="checkbox"
                checked={onlyNew}
                onChange={(e) => setOnlyNew(e.target.checked)}
              />
            </label>
          </div>
          <label htmlFor="filter-date" className="job-filter-label">
            After
            <input
              id="filter-date"
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="job-filter-input"
            />
          </label>
          <label htmlFor="min-stars" className="job-filter-label">
            Fit
            <select
              id="min-stars"
              value={minStars}
              onChange={(e) => {
                const next = parseInt(e.target.value, 10);
                setMinStars(Number.isNaN(next) ? 1 : next);
              }}
              className="job-filter-select"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => {
              setFilterDate(getDefaultWindowDate());
              setMinStars(1);
              setOnlyNew(false);
            }}
            className="job-filter-clear"
          >
            Clear
          </button>
        </div>
        <hr />
        <div className="jobs-list">
          {filteredJobs.map((job) => (
            <div key={`${job.metadata.id}-${job.title}`} className="job-item">
              <p>
                <a href={job.url} target="_blank" rel="noopener noreferrer">
                  <strong>{job.metadata.isNew ? '[NEW] ' : ''}{job.title}</strong>
                </a>
                {' 🌟'.repeat(job.metadata.stars || 0)}
              </p>
              <p><strong>Location:</strong> {job.metadata.location}</p>
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

export default Job;
