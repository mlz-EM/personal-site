import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import Main from '../../layouts/Main';
import PageHeader from './PageHeader';
import PageTools from './PageTools';
import FeedBasicInfo from './FeedBasicInfo';
import useFeedFilters from '../../hooks/useFeedFilters';
import FeedFilters from './FeedFilters';
import JobFeedItem from './JobFeedItem';

const SourceJobsPage = ({
  description,
  emptySourceLabel,
  feedLoader,
  pageTitle,
  routeKey,
}) => {
  const feed = useMemo(() => feedLoader(), [feedLoader]);
  const filters = useFeedFilters(feed.items, { withFit: true });
  const topId = `${routeKey}-jobs`;
  const filterId = `${routeKey}-job-filters`;
  const tools = [
    { label: 'Top', href: `#${topId}` },
    { label: 'Filters', href: `#${filterId}` },
    { label: 'TTAP', to: '/job' },
  ];

  return (
    <Main title={pageTitle} description={description} wrapperClassName="jobs-layout">
      <article className="post markdown jobs-page" id={topId}>
        <PageHeader title={feed.source || emptySourceLabel} />
        <PageTools items={tools} ariaLabel={`${emptySourceLabel} page tools`} />
        <FeedBasicInfo header={feed.header} />
        <FeedFilters
          filters={filters}
          id={filterId}
          idPrefix={`${routeKey}-`}
          withFit
          sources={Array.isArray(feed.sources) ? feed.sources : []}
        />
        <hr />
        <div className="jobs-list">
          {filters.filteredItems.length === 0 ? (
            <p>No {emptySourceLabel} jobs match the selected filters.</p>
          ) : filters.filteredItems.map((job) => (
            <JobFeedItem key={job.url} job={job} showSource />
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
