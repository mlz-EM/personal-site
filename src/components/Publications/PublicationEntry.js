import React from 'react';
import PropTypes from 'prop-types';

// Render the inline formatting in Paperpile titles as React elements.
const formatTitle = (title) => {
  const parts = [];
  let offset = 0;
  Array.from(title.matchAll(/<(sub|sup|i|b)>([^<>]*)<\/\1>/g)).forEach((match) => {
    const [, Tag, text] = match;
    parts.push(title.slice(offset, match.index), <Tag key={match.index}>{text}</Tag>);
    offset = match.index + match[0].length;
  });
  return [...parts, title.slice(offset)];
};

const renderAuthor = (author, index) => (
  <React.Fragment key={author.position}>
    {index > 0 && ', '}
    {author.isOwner ? <em className="publication-owner">{author.name}</em> : author.name}
    {author.equalContributor && (
      <sup className="publication-author-marker" title="Equal contribution">*</sup>
    )}
    {author.corresponding && (
      <sup className="publication-author-marker" title="Corresponding author">#</sup>
    )}
  </React.Fragment>
);

const PublicationEntry = ({ paper, showAllAuthors }) => {
  const {
    title, authors, journal, url, arxiv,
  } = paper;
  const shownAuthors = showAllAuthors
    ? authors
    : authors.filter((author) => author.position === 0 || author.equalContributor);
  const paperTitle = (
    <>
      {journal && <cite className="publication-journal">[{journal}] </cite>}
      {formatTitle(title)}
    </>
  );

  return (
    <li className="listing-entry">
      <h4 className="listing-title">
        {url ? <a href={url} target="_blank" rel="noreferrer">{paperTitle}</a> : paperTitle}
      </h4>
      {authors.length > 0 && (
        <p className="publication-authors">
          {shownAuthors.map(renderAuthor)}
          {shownAuthors.length < authors.length && <>, <i>et al.</i></>}
        </p>
      )}
      {arxiv && arxiv !== url && <p><a href={arxiv} target="_blank" rel="noreferrer">arXiv</a></p>}
    </li>
  );
};

PublicationEntry.propTypes = {
  showAllAuthors: PropTypes.bool.isRequired,
  paper: PropTypes.shape({
    title: PropTypes.string.isRequired,
    authors: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      position: PropTypes.number.isRequired,
      isOwner: PropTypes.bool.isRequired,
      equalContributor: PropTypes.bool.isRequired,
      corresponding: PropTypes.bool.isRequired,
    })).isRequired,
    journal: PropTypes.string,
    url: PropTypes.string,
    arxiv: PropTypes.string,
  }).isRequired,
};

export default PublicationEntry;
