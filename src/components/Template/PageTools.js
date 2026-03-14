import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ENABLE_PAGE_TOOLS = false;

const PageTools = ({ items, ariaLabel }) => (
  !ENABLE_PAGE_TOOLS ? null : (
    <nav className="page-tools" aria-label={ariaLabel}>
      <ul className="page-tools-list">
        {items.map((item) => (
          <li key={`${item.label}-${item.href || item.to}`} className="page-tools-item">
            {item.to ? (
              <Link className="page-tools-link" to={item.to}>
                {item.label}
              </Link>
            ) : (
              <a
                className="page-tools-link"
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
              >
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
);

PageTools.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
      to: PropTypes.string,
      external: PropTypes.bool,
    }),
  ).isRequired,
  ariaLabel: PropTypes.string.isRequired,
};

export default PageTools;
