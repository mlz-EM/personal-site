import React, { useMemo } from 'react';
import Main from '../layouts/Main';
import PageHeader from '../components/Template/PageHeader';
import PageTools from '../components/Template/PageTools';
import FeedBasicInfo from '../components/Template/FeedBasicInfo';
import EmptyFeedMessage from '../components/Template/EmptyFeedMessage';
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
    <Main title="Jobs" description="Combined AI-filtered faculty opportunities from TTAP, Interfolio, Chronicle, and Inside Higher Ed" wrapperClassName="feed-layout">
      <article className="post listing-page feed-page" id="jobs">
        <PageHeader title={feed.source || 'Faculty Jobs'} />
        <PageTools items={JOB_TOOLS} ariaLabel="Job page tools" />
        <FeedBasicInfo header={feed.header} />
        <FeedFilters filters={filters} id="job-filters" withFit />
        <hr />
        {filters.filteredItems.length === 0 ? (
          <EmptyFeedMessage>No Faculty jobs match the selected filters.</EmptyFeedMessage>
        ) : (
          <ul className="listing-list">
            {filters.filteredItems.map((job) => <JobFeedItem key={job.url} job={job} />)}
          </ul>
        )}
      </article>
    </Main>
  );
};

export default Job;
