import React from 'react';
import PropTypes from 'prop-types';

const PageHeader = ({ title, subtitle, subtitleClassName }) => (
  <header className="page-header">
    <div className="title">
      <h2 className="page-heading">{title}</h2>
      {subtitle ? <p className={subtitleClassName}>{subtitle}</p> : null}
    </div>
  </header>
);

PageHeader.propTypes = {
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
  subtitleClassName: PropTypes.string,
};

PageHeader.defaultProps = {
  subtitle: null,
  subtitleClassName: 'page-subtitle',
};

export default PageHeader;
