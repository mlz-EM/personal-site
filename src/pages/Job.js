import React, { useMemo } from 'react';
import Main from '../layouts/Main';
import PageHeader from '../components/Template/PageHeader';
import PageTools from '../components/Template/PageTools';
import FeedBasicInfo from '../components/Template/FeedBasicInfo';
import getJobsFeed from '../content/jobsFeed';
import useFeedFilters from '../hooks/useFeedFilters';
import FeedFilters from '../components/Template/FeedFilters';
import JobFeedItem from '../components/Template/JobFeedItem';

const JOB_TOOLS = [
  { label: 'Top', href: '#jobs' },
  { label: 'Filters', href: '#job-filters' },
  { label: 'arXiv', to: '/arxiv' },
];

const Job = () => {
  const feed = useMemo(() => getJobsFeed(), []);
  const filters = useFeedFilters(feed.items, { withFit: true });

  return (
    <Main title="Jobs" description="Jobs Daily Feed" wrapperClassName="jobs-layout">
      <article className="post markdown jobs-page" id="jobs">
        <PageHeader title={feed.source || 'TTAP Daily Feed'} />
        <PageTools items={JOB_TOOLS} ariaLabel="Job page tools" />
        <FeedBasicInfo header={feed.header} />
        <FeedFilters filters={filters} id="job-filters" withFit />
        <hr />
        <div className="jobs-list">
          {filters.filteredItems.length === 0 ? (
            <p>No Faculty jobs match the selected filters.</p>
          ) : filters.filteredItems.map((job) => (
            <JobFeedItem key={job.url} job={job} />
          ))}
        </div>
      </article>
    </Main>
  );
};

export default Job;
