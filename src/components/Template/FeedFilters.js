import React from 'react';
import PropTypes from 'prop-types';

const FeedFilters = ({
  filters, id, idPrefix, withFit, sources,
}) => (
  <div className="filter-section job-filter-row" id={id}>
    <div className="jobs-filter-new">
      <label htmlFor={`${idPrefix}only-new`} className="job-filter-label">
        NEW
        <input
          id={`${idPrefix}only-new`}
          type="checkbox"
          checked={filters.onlyNew}
          onChange={(event) => filters.setOnlyNew(event.target.checked)}
        />
      </label>
    </div>
    <label htmlFor={`${idPrefix}filter-date`} className="job-filter-label">
      After
      <input
        id={`${idPrefix}filter-date`}
        type="date"
        value={filters.filterDate}
        onChange={(event) => filters.setFilterDate(event.target.value)}
        className="job-filter-input"
      />
    </label>
    {withFit ? (
      <label htmlFor={`${idPrefix}min-stars`} className="job-filter-label">
        Fit
        <select
          id={`${idPrefix}min-stars`}
          value={filters.minStars}
          onChange={(event) => {
            const next = parseInt(event.target.value, 10);
            filters.setMinStars(Number.isNaN(next) ? 1 : next);
          }}
          className="job-filter-select"
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
        </select>
      </label>
    ) : null}
    {sources ? (
      <label htmlFor={`${idPrefix}source`} className="job-filter-label job-filter-source">
        Source
        <select
          id={`${idPrefix}source`}
          value={filters.selectedSource}
          onChange={(event) => filters.setSelectedSource(event.target.value)}
          className="job-filter-select"
        >
          <option value="all">All</option>
          {sources.map((source) => (
            <option key={source} value={source}>{source}</option>
          ))}
        </select>
      </label>
    ) : null}
    <button type="button" onClick={filters.clearFilters} className="job-filter-clear">
      Clear
    </button>
  </div>
);

FeedFilters.propTypes = {
  filters: PropTypes.shape({
    filterDate: PropTypes.string.isRequired,
    setFilterDate: PropTypes.func.isRequired,
    onlyNew: PropTypes.bool.isRequired,
    setOnlyNew: PropTypes.func.isRequired,
    minStars: PropTypes.number.isRequired,
    setMinStars: PropTypes.func.isRequired,
    selectedSource: PropTypes.string.isRequired,
    setSelectedSource: PropTypes.func.isRequired,
    clearFilters: PropTypes.func.isRequired,
  }).isRequired,
  id: PropTypes.string.isRequired,
  idPrefix: PropTypes.string,
  withFit: PropTypes.bool,
  sources: PropTypes.arrayOf(PropTypes.string),
};

FeedFilters.defaultProps = { idPrefix: '', withFit: false, sources: null };

export default FeedFilters;
