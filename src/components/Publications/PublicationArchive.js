import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { getPublicationGroups, publicationCount, publicationPeriod } from '../../content/publications';
import PageHeader, { ExpandAllButton } from '../Template/PageHeader';
import EmptyFeedMessage from '../Template/EmptyFeedMessage';
import PublicationEntry from './PublicationEntry';

const publicationNoun = (count) => (count === 1 ? 'publication' : 'publications');

const PublicationArchive = ({ title, subtitle }) => {
  const [query, setQuery] = useState('');
  const [showAllAuthors, setShowAllAuthors] = useState(true);
  const [browseYears, setBrowseYears] = useState({});
  const [searchYears, setSearchYears] = useState({});
  const searching = Boolean(query.trim());
  const groups = getPublicationGroups(query);
  const [years, setYears] = searching
    ? [searchYears, setSearchYears] : [browseYears, setBrowseYears];
  const isOpen = (year) => years[year] ?? searching;
  const anyOpen = groups.some(({ year }) => isOpen(year));
  const toggleAll = () => setYears(Object.fromEntries(groups.map(({ year }) => [year, !anyOpen])));
  const changeSearch = ({ target }) => {
    setQuery(target.value);
    setSearchYears({});
  };

  return (
    <>
      <PageHeader
        title={title}
        subtitle={subtitle}
        subtitleClassName="publications-metrics"
        titleActions={(
          <ExpandAllButton
            anyOpen={anyOpen}
            onClick={toggleAll}
            disabled={!groups.length}
            controls="publication-years"
          />
        )}
      />
      <div className="publication-archive">
        <h3>Basic Info</h3>
        <ul className="feed-basic-info">
          <li>{publicationCount} peer-reviewed publications I contributed to{publicationPeriod}</li>
          <li>Equal contribution denoted by <strong>*</strong></li>
          <li>Corresponding authors denoted by <strong>#</strong></li>
        </ul>
        <div
          className="job-filter-row publication-filter-row"
          role="group"
          aria-label="Publication options"
        >
          <div className="listing-filter-checkbox">
            <label htmlFor="publication-full" className="job-filter-label" title="Show all authors">
              FULL
              <input
                id="publication-full"
                type="checkbox"
                checked={showAllAuthors}
                onChange={(event) => setShowAllAuthors(event.target.checked)}
              />
            </label>
          </div>
          <label htmlFor="publication-search" className="job-filter-label filter-field">
            Search
            <input
              id="publication-search"
              type="search"
              className="job-filter-input"
              placeholder="Title or author"
              value={query}
              onChange={changeSearch}
            />
          </label>
        </div>
        <hr />
        <div id="publication-years">
          {!groups.length && (
            <EmptyFeedMessage>
              {searching ? 'No publications match your search.' : 'No publications available.'}
            </EmptyFeedMessage>
          )}
          {groups.map(({ year, papers }) => (
            <details
              className="publication-year"
              key={year}
              open={isOpen(year)}
              onToggle={(event) => {
                const { open } = event.currentTarget;
                if (open !== isOpen(year)) setYears((current) => ({ ...current, [year]: open }));
              }}
            >
              <summary aria-label={`${year}, ${papers.length} ${publicationNoun(papers.length)}`}>
                <h3 className="disclosure-title">{`${year} (${papers.length})`}</h3>
              </summary>
              <ul className="listing-list">
                {papers.map((paper) => (
                  <PublicationEntry key={paper.id} paper={paper} showAllAuthors={showAllAuthors} />
                ))}
              </ul>
            </details>
          ))}
        </div>
      </div>
    </>
  );
};

PublicationArchive.propTypes = {
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node.isRequired,
};

export default PublicationArchive;
