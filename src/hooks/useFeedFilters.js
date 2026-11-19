import { useState } from 'react';
import { getDateInputValueDaysAgo } from '../utils/dateInput';

const getDefaultWindowDate = () => getDateInputValueDaysAgo(30);

// Clear preserves the rolling date window, but includes previously seen items.
const useFeedFilters = (items, { withFit = false } = {}) => {
  const [filterDate, setFilterDate] = useState(getDefaultWindowDate);
  const [onlyNew, setOnlyNew] = useState(true);
  const [minStars, setMinStars] = useState(1);

  const filteredItems = items.filter((item) => (
    (!filterDate || new Date(item.date) >= new Date(filterDate))
    && (!onlyNew || Boolean(item.metadata.isNew))
    && (!withFit || (item.metadata.stars || 0) >= minStars)
  ));

  const clearFilters = () => {
    setFilterDate(getDefaultWindowDate());
    setOnlyNew(false);
    setMinStars(1);
  };

  return {
    filteredItems,
    filterDate,
    setFilterDate,
    onlyNew,
    setOnlyNew,
    minStars,
    setMinStars,
    clearFilters,
  };
};

export default useFeedFilters;
