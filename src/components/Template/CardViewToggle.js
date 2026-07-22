import React from 'react';
import PropTypes from 'prop-types';

const CardViewToggle = ({ mode, onToggle, enabled }) => {
  if (!enabled) return null;

  const isExpanded = mode === 'expanded';

  return (
    <div className="card-view-toolbar">
      <button
        type="button"
        className="card-view-toggle"
        onClick={onToggle}
        aria-pressed={isExpanded}
      >
        {isExpanded ? 'Use Compact Cards' : 'Use Expanded Cards'}
      </button>
    </div>
  );
};

CardViewToggle.propTypes = {
  mode: PropTypes.oneOf(['compact', 'expanded']).isRequired,
  onToggle: PropTypes.func.isRequired,
  enabled: PropTypes.bool,
};

CardViewToggle.defaultProps = {
  enabled: true,
};

export default CardViewToggle;
