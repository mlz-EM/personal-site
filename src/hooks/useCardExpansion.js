import { useCallback, useState } from 'react';

const useCardExpansion = () => {
  const [bulkCommand, setBulkCommand] = useState({ expanded: false });
  const [expandedCards, setExpandedCards] = useState({});
  const anyOpen = Object.values(expandedCards).some(Boolean);
  const onExpandedChange = useCallback((id, expanded) => {
    setExpandedCards((cards) => (cards[id] === expanded
      ? cards : { ...cards, [id]: expanded }));
  }, []);

  return {
    anyOpen,
    toggleAll: () => setBulkCommand({ expanded: !anyOpen }),
    cardProps: { bulkCommand, onExpandedChange },
  };
};

export default useCardExpansion;
