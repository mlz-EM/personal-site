import React from 'react';
import PropTypes from 'prop-types';

const JobFeedItem = ({ job }) => (
  <li className="listing-entry job-item">
    <h3 className="listing-title">
      <a href={job.url} target="_blank" rel="noopener noreferrer">
        {job.metadata.isNew ? '[NEW] ' : ''}{job.title}
      </a>
      {' 🌟'.repeat(job.metadata.stars || 0)}
    </h3>
    <p className="job-item-location"><strong>Location:</strong> {job.metadata.location}</p>
    <p className="job-item-date"><strong>Date:</strong> {job.date}</p>
    <p className="job-item-description">
      <strong>Description:</strong>{' '}
      {job.metadata.description || 'N/A'}
    </p>
  </li>
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
