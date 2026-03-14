import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import Main from '../layouts/Main';
import useMarkdown from '../hooks/useMarkdown';
import PageHeader from '../components/Template/PageHeader';
import PageTools from '../components/Template/PageTools';
import { parseJobsMarkdown } from '../content/api';
import 'katex/dist/katex.min.css';

const importJobsMarkdown = () => import('../data/jobsDaily.md');
const JOB_TOOLS = [
  { label: 'Top', href: '#jobs' },
  { label: 'Filters', href: '#job-filters' },
  { label: 'arXiv', to: '/arxiv' },
];

const Job = () => {
  const { markdown, loading, error } = useMarkdown(importJobsMarkdown);
  const [filterDate, setFilterDate] = useState('');
  const [minStars, setMinStars] = useState(1);
  const [onlyNew, setOnlyNew] = useState(false);

  const parsed = useMemo(() => parseJobsMarkdown(markdown), [markdown]);

  const filteredJobs = parsed.items.filter((job) => {
    const dateMatch = !filterDate || new Date(job.date) >= new Date(filterDate);
    const starsMatch = (job.metadata.stars || 0) >= minStars;
    const newMatch = !onlyNew || Boolean(job.metadata.isNew);
    return dateMatch && starsMatch && newMatch;
  });

  const renderJob = (job) => (
    <div key={job.title} className="job-item">
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
        {job.metadata.description}
      </p>
      <hr />
    </div>
  );

  return (
    <Main title="Jobs" description="Jobs Daily Feed">
      <article className="post markdown" id="jobs">
        <PageHeader title="TTAP Daily Feed" />
        <PageTools items={JOB_TOOLS} ariaLabel="Job page tools" />
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {parsed.basicInfo}
        </ReactMarkdown>
        {loading && <p>Loading jobs feed...</p>}
        {error && <p>Unable to load jobs feed.</p>}
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
            Jobs Posted After
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
              setFilterDate('');
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
          {filteredJobs.map(renderJob)}
        </div>
      </article>
    </Main>
  );
};

export default Job;
