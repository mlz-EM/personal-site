import React from 'react';
import PropTypes from 'prop-types';

const JobFeedItem = ({ job }) => (
  <div className="job-item">
    <p className="job-item-title">
      <a href={job.url} target="_blank" rel="noopener noreferrer">
        <strong>{job.metadata.isNew ? '[NEW] ' : ''}{job.title}</strong>
      </a>
      {' 🌟'.repeat(job.metadata.stars || 0)}
    </p>
    <p className="job-item-location"><strong>Location:</strong> {job.metadata.location}</p>
    <p className="job-item-date"><strong>Date:</strong> {job.date}</p>
    <p className="job-item-description">
      <strong>Description:</strong>{' '}
      {job.metadata.description || 'N/A'}
    </p>
    <hr />
  </div>
);

JobFeedItem.propTypes = {
  job: PropTypes.shape({
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    metadata: PropTypes.shape({
      isNew: PropTypes.bool,
      stars: PropTypes.number,
      location: PropTypes.string,
      description: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default JobFeedItem;
