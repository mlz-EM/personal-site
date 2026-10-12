import { useState } from 'react';
import { getDateInputValueDaysAgo } from '../utils/dateInput';

const getDefaultWindowDate = () => getDateInputValueDaysAgo(30);

// Clear preserves the rolling date window, but includes previously seen items.
const useFeedFilters = (items, { withFit = false } = {}) => {
  const [filterDate, setFilterDate] = useState(getDefaultWindowDate);
  const [onlyNew, setOnlyNew] = useState(true);
  const [minStars, setMinStars] = useState(1);
  const [selectedSource, setSelectedSource] = useState('all');

  const filteredItems = items.filter((item) => (
    (!filterDate || new Date(item.date) >= new Date(filterDate))
    && (!onlyNew || Boolean(item.metadata.isNew))
    && (!withFit || (item.metadata.stars || 0) >= minStars)
    && (selectedSource === 'all' || item.source === selectedSource)
  ));

  const clearFilters = () => {
    setFilterDate(getDefaultWindowDate());
    setOnlyNew(false);
    setMinStars(1);
    setSelectedSource('all');
  };

  return {
    filteredItems,
    filterDate,
    setFilterDate,
    onlyNew,
    setOnlyNew,
    minStars,
    setMinStars,
    selectedSource,
    setSelectedSource,
    clearFilters,
  };
};

export default useFeedFilters;
