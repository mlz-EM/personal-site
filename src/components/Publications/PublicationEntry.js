import React from 'react';
import PropTypes from 'prop-types';

// Render the inline formatting produced by the BibTeX parser as React elements.
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

const ownerName = /^(?:(?:Menglin|M\.?)\s+Zhu|Zhu,\s*(?:Menglin|M\.?))$/i;

const highlightAuthor = (name, position) => (ownerName.test(name)
  ? <strong className="publication-owner" key={position}>{name}</strong>
  : name);

const PublicationEntry = ({ paper }) => {
  const {
    title, authors, venue, volume, issue, pages, year, url, arxiv,
  } = paper;
  const names = authors.flatMap((name, index) => [index ? ', ' : '', highlightAuthor(name, index)]);
  const locator = [volume && `${volume}${issue ? `(${issue})` : ''}`, pages].filter(Boolean).join(', ');

  return (
    <li className="publication-entry">
      <h4>
        {url ? <a href={url} target="_blank" rel="noreferrer">{formatTitle(title)}</a>
          : formatTitle(title)}
      </h4>
      {authors.length > 0 && <p className="publication-authors">{names}</p>}
      <p className="publication-citation">
        {venue && <cite>{venue}</cite>}
        {locator && ` ${locator}`}
        {year && ` (${year})`}
        {arxiv && arxiv !== url && (
          <> · <a href={arxiv} target="_blank" rel="noreferrer">arXiv</a></>
        )}
      </p>
    </li>
  );
};

PublicationEntry.propTypes = {
  paper: PropTypes.shape({
    title: PropTypes.string.isRequired,
    authors: PropTypes.arrayOf(PropTypes.string).isRequired,
    venue: PropTypes.string,
    volume: PropTypes.string,
    issue: PropTypes.string,
    pages: PropTypes.string,
    year: PropTypes.number,
    url: PropTypes.string,
    arxiv: PropTypes.string,
  }).isRequired,
};

export default PublicationEntry;
