import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Cell from '../Projects/Cell';
import MiniCell from './MiniCell';

const AdaptiveCard = ({
  data,
  enableExpand,
  bulkCommand,
  cardId,
  onExpandedChange,
}) => {
  const [expanded, setExpanded] = useState(false);
  const {
    title: projectTitle,
    label,
    date: normalizedDate,
    image,
    link: rawLink,
    summary: rawSummary,
    expandable,
    pinned,
  } = data;
  const title = projectTitle || label;
  const link = rawLink || '';
  const summary = rawSummary || '';
  const canExpand = enableExpand && expandable === true;
  const buttonLabel = expanded ? 'Close details' : 'Open details';
  const buttonAria = expanded ? `Collapse ${title}` : `Expand ${title}`;
  const normalizedData = {
    title,
    date: normalizedDate,
    image,
    link,
    summary,
  };
  const cardClassName = [
    'adaptive-card',
    expanded ? 'is-expanded' : 'is-compact',
    canExpand ? 'is-expandable' : 'is-fixed',
    pinned ? 'is-pinned' : '',
  ].join(' ');

  useEffect(() => {
    if (!canExpand || !bulkCommand) return;
    setExpanded(bulkCommand.expanded);
  }, [canExpand, bulkCommand]);

  useEffect(() => {
    if (!canExpand || !onExpandedChange) return;
    onExpandedChange(cardId, expanded);
  }, [canExpand, cardId, expanded, onExpandedChange]);

  const toggleExpanded = () => setExpanded((prev) => !prev);
  const handleCardClick = (event) => {
    if (!canExpand) return;
    const { target } = event;
    if (
      target instanceof Element
      && target.closest('a, button, input, select, textarea, label')
    ) {
      return;
    }
    toggleExpanded();
  };

  return (
    <div className={cardClassName} onClick={handleCardClick}>
      {pinned ? (
        <span className="adaptive-card-staple" aria-label="Pinned item" title="Pinned item">
          <img
            src={`${process.env.PUBLIC_URL}/images/icons/pin.svg`}
            alt=""
            aria-hidden="true"
          />
        </span>
      ) : null}
      <div className="adaptive-card-content">
        {expanded ? (
          <Cell data={normalizedData} />
        ) : (
          <MiniCell
            data={{
              label: title,
              date: normalizedDate,
              image,
              link,
            }}
          />
        )}
      </div>
      {canExpand ? (
        <button
          type="button"
          className={`adaptive-card-corner-toggle ${expanded ? 'is-open' : 'is-closed'}`}
          onClick={toggleExpanded}
          aria-expanded={expanded}
          aria-label={buttonAria}
          title={buttonLabel}
        >
          <span className="visually-hidden">{buttonLabel}</span>
          <span className="adaptive-card-corner-icon" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
};

AdaptiveCard.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    label: PropTypes.string,
    link: PropTypes.string,
    image: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    summary: PropTypes.string,
    expandable: PropTypes.bool,
    pinned: PropTypes.bool,
  }).isRequired,
  enableExpand: PropTypes.bool,
  bulkCommand: PropTypes.shape({
    expanded: PropTypes.bool.isRequired,
    nonce: PropTypes.number.isRequired,
  }),
  cardId: PropTypes.string,
  onExpandedChange: PropTypes.func,
};

AdaptiveCard.defaultProps = {
  enableExpand: true,
  bulkCommand: null,
  cardId: '',
  onExpandedChange: null,
};

export default AdaptiveCard;
