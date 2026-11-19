import React from 'react';
import PropTypes from 'prop-types';
import paperpile from '../../data/paperpile.json';
import PageHeader, { ExpandAllButton } from '../Template/PageHeader';
import useDetailsGroup from '../../hooks/useDetailsGroup';
import PublicationEntry from './PublicationEntry';

const papersByYear = new Map();
paperpile.publications.forEach((paper) => {
  const year = String(paper.year || 'Undated');
  if (!papersByYear.has(year)) papersByYear.set(year, []);
  papersByYear.get(year).push(paper);
});
const years = [...papersByYear.keys()].sort((a, b) => (Number(b) || 0) - (Number(a) || 0));
const publicationNoun = (count) => (count === 1 ? 'publication' : 'publications');

const PublicationArchive = ({ title, subtitle }) => {
  const { groupProps, anyOpen, toggleAll } = useDetailsGroup();

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
            disabled={!years.length}
            controls="publication-years"
          />
        )}
      />
      <div className="publication-archive" id="publication-years" {...groupProps}>
        {!years.length && <p>No publications available.</p>}
        {years.map((year) => {
          const papers = papersByYear.get(year);
          return (
            <details className="publication-year" key={year}>
              <summary aria-label={`${year}, ${papers.length} ${publicationNoun(papers.length)}`}>
                <h3 className="disclosure-title">{`${year} (${papers.length})`}</h3>
              </summary>
              <ul className="publication-list">
                {papers.map((paper) => <PublicationEntry key={paper.id} paper={paper} />)}
              </ul>
            </details>
          );
        })}
      </div>
    </>
  );
};

PublicationArchive.propTypes = {
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node.isRequired,
};

export default PublicationArchive;
