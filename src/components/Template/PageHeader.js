import React from 'react';
import PropTypes from 'prop-types';

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
