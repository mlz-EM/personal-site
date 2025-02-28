import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import Main from '../layouts/Main';
import 'katex/dist/katex.min.css'; // Make sure this is imported

const parseJob = (section) => {
  const lines = section.trim().split('\n');
  const titleLine = lines[0];
  const titleMatch = titleLine.match(/\[([^\]]+)\]\(([^)]+)\)/);
  if (!titleMatch) return null;

  const rawTitle = titleMatch[1];
  const link = titleMatch[2];

  // Count stars from the whole section to avoid parsing edge cases.
  const stars = Number((section.match(/🌟/g) || []).length);

  const lineHasNew = /\[NEW\]/i.test(titleLine);
  const isNew = lineHasNew || /^\s*\[NEW\]/i.test(rawTitle);
  const cleanedTitle = rawTitle.replace(/^\s*\[NEW\]\s*/i, '');

  let location = '';
  let date = '';
  let description = '';
  let keyword = '';

  lines.slice(1).forEach((line) => {
    if (line.includes('**Location**:')) location = line.split('**Location**:')[1].trim();
    if (line.includes('**Date**:')) date = line.split('**Date**:')[1].trim();
    if (line.includes('**Description**:')) description = line.split('**Description**:')[1].trim();
    if (line.includes('**Keyword**:')) keyword = line.split('**Keyword**:')[1].trim();
  });

  return {
    title: cleanedTitle,
    titlePrefix: isNew ? '[NEW] ' : '',
    link,
    stars,
    isNew,
    location,
    date,
    description,
    keyword,
  };
};

const Job = () => {
  const [basicInfo, setBasicInfo] = useState('');
  const [jobs, setJobs] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [minStars, setMinStars] = useState(1);
  const [onlyNew, setOnlyNew] = useState(false);

  useEffect(() => {
    import('../data/jobsDaily.md').then((res) => {
      fetch(res.default)
        .then((r) => r.text())
        .then((text) => {
          const parts = text.split('---');
          const basic = parts[0];
          const jobSections = parts.slice(1).filter((s) => s.trim() && s.includes('**['));
          const parsedJobs = jobSections.map(parseJob).filter((job) => job !== null);
          setBasicInfo(basic);
          setJobs(parsedJobs);
        });
    });
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const dateMatch = !filterDate || new Date(job.date) >= new Date(filterDate);
    const starsMatch = job.stars >= minStars;
    const newMatch = !onlyNew || job.isNew;
    return dateMatch && starsMatch && newMatch;
  });

  const renderJob = (job) => (
    <div key={job.title} className="job-item">
      <p>
        <a href={job.link} target="_blank" rel="noopener noreferrer">
          <strong>{job.titlePrefix}{job.title}</strong>
        </a>
        {' 🌟'.repeat(job.stars)}
      </p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Date:</strong> {job.date}</p>
      <p>
        <strong>Description:</strong>{' '}
        {job.description}
      </p>
      <hr />
    </div>
  );

  return (
    <Main title="Jobs" description="Jobs Daily Feed">
      <article className="post markdown" id="jobs">
        <header>
          <div className="title">
            <h2>
              TTAP Daily Feed
            </h2>
          </div>
        </header>
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {basicInfo}
        </ReactMarkdown>
        <div
          className="filter-section"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '50px',
            marginBottom: '-25px',
            marginTop: '-10px',
          }}
        >
          <div className="jobs-filter-new">
            <label htmlFor="only-new" style={{ display: 'flex', alignItems: 'center' }}>
              NEW
              <input
                id="only-new"
                type="checkbox"
                checked={onlyNew}
                onChange={(e) => setOnlyNew(e.target.checked)}
              />
            </label>
          </div>
          <label htmlFor="filter-date" style={{ display: 'flex', alignItems: 'center' }}>
            Jobs Posted After
            <input
              id="filter-date"
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              style={{
                borderRadius: '5px',
                width: '120px',
                height: '30px',
                marginLeft: '5px',
              }}
            />
          </label>
          <label htmlFor="min-stars" style={{ display: 'flex', alignItems: 'center' }}>
            Fit
            <select
              id="min-stars"
              value={minStars}
              onChange={(e) => {
                const next = parseInt(e.target.value, 10);
                setMinStars(Number.isNaN(next) ? 1 : next);
              }}
              style={{
                width: '45px',
                height: '30px',
                borderRadius: '5px',
                marginLeft: '5px',
              }}
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
            style={{
              width: '60px',
              height: '30px',
              borderRadius: '5px',
              marginLeft: '5px',
              marginTop: '-15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
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
