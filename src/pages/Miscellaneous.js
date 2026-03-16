import React, { useCallback, useState } from 'react';
import Main from '../layouts/Main';
import AdaptiveCard from '../components/Template/AdaptiveCard';
import PageHeader from '../components/Template/PageHeader';
import PageTools from '../components/Template/PageTools';
import { getMiscItems } from '../content/api';

const ENABLE_PER_CARD_EXPAND = true;
const MISC_TOOLS = [
  { label: 'Top', href: '#miscellaneous' },
  { label: 'Projects', to: '/projects' },
  { label: 'Resources', to: '/resources' },
];

const Miscellaneous = () => {
  const [bulkCommand, setBulkCommand] = useState({ expanded: false, nonce: 0 });
  const [expandedStates, setExpandedStates] = useState({});

  const runBulkCommand = (expanded) => {
    setBulkCommand((prev) => ({
      expanded,
      nonce: prev.nonce + 1,
    }));
  };
  const handleExpandedChange = useCallback((cardId, isExpanded) => {
    setExpandedStates((prev) => (
      prev[cardId] === isExpanded
        ? prev
        : {
          ...prev,
          [cardId]: isExpanded,
        }
    ));
  }, []);
  const anyOpen = Object.values(expandedStates).some(Boolean);

  const titleActions = (
    <button
      type="button"
      className="page-title-action-btn"
      onClick={() => runBulkCommand(!anyOpen)}
    >
      {anyOpen ? 'Collapse all' : 'Expand all'}
    </button>
  );

  return (
    <Main title="Miscellaneous" description="Learn about Menglin Zhu's Miscellaneous.">
      <article className="post" id="miscellaneous">
        <PageHeader title="Miscellaneous" titleActions={titleActions} />
        <PageTools items={MISC_TOOLS} ariaLabel="Miscellaneous page tools" />
        {getMiscItems().map((badge) => (
          <AdaptiveCard
            data={badge}
            key={badge.label}
            cardId={badge.label}
            enableExpand={ENABLE_PER_CARD_EXPAND}
            bulkCommand={bulkCommand}
            onExpandedChange={handleExpandedChange}
          />
        ))}
      </article>
    </Main>
  );
};

export default Miscellaneous;
