import React from 'react';
import PropTypes from 'prop-types';

export const ExpandAllButton = ({
  anyOpen, onClick, controls, disabled,
}) => (
  <button
    type="button"
    className="page-title-action-btn"
    onClick={onClick}
    aria-controls={controls}
    disabled={disabled}
  >
    {anyOpen ? 'Collapse all' : 'Expand all'}
  </button>
);

ExpandAllButton.propTypes = {
  anyOpen: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  controls: PropTypes.string,
  disabled: PropTypes.bool,
};

ExpandAllButton.defaultProps = { controls: undefined, disabled: false };

const PageHeader = ({
  title,
  subtitle,
  subtitleClassName,
  titleActions,
}) => (
  <header className="page-header">
    <div className="title">
      <div className="page-heading-row">
        <h2 className="page-heading">{title}</h2>
        {titleActions ? <div className="page-title-actions">{titleActions}</div> : null}
      </div>
      {subtitle ? <p className={subtitleClassName}>{subtitle}</p> : null}
    </div>
  </header>
);

PageHeader.propTypes = {
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
  subtitleClassName: PropTypes.string,
  titleActions: PropTypes.node,
};

PageHeader.defaultProps = {
  subtitle: null,
  subtitleClassName: 'page-subtitle',
  titleActions: null,
};

export default PageHeader;
