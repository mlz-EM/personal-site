import React from 'react';
import PropTypes from 'prop-types';

const EmptyFeedMessage = ({ children }) => (
  <div className="listing-entry" role="status">
    <p className="listing-title">{children}</p>
  </div>
);

EmptyFeedMessage.propTypes = { children: PropTypes.string.isRequired };

export default EmptyFeedMessage;
