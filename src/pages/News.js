import React, { useCallback, useMemo, useState } from 'react';
import Main from '../layouts/Main';
import AdaptiveCard from '../components/Template/AdaptiveCard';
import PageHeader from '../components/Template/PageHeader';
import PageTools from '../components/Template/PageTools';
import { getNewsItems } from '../content/api';

const ENABLE_PER_CARD_EXPAND = true;
const NEWS_TOOLS = [
  { label: 'Top', href: '#news' },
  { label: 'Filters', href: '#news-filters' },
  { label: 'Projects', to: '/projects' },
  { label: 'Resources', to: '/resources' },
];

const News = () => {
  const items = useMemo(() => getNewsItems(), []);
  const [bulkCommand, setBulkCommand] = useState({ expanded: false, nonce: 0 });
  const [expandedStates, setExpandedStates] = useState({});
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const availableYears = useMemo(() => (
    [...new Set(items.map((item) => item.date.slice(0, 4)))]
      .sort((a, b) => Number(b) - Number(a))
  ), [items]);
  const availableCategories = useMemo(() => (
    [...new Set(items.map((item) => item.category || 'misc'))]
      .sort((a, b) => a.localeCompare(b))
  ), [items]);

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
  const filteredItems = useMemo(() => items.filter((item) => {
    const itemYear = item.date.slice(0, 4);
    const itemCategory = item.category || 'misc';
    const yearMatch = selectedYear === 'all' || itemYear === selectedYear;
    const categoryMatch = selectedCategory === 'all' || itemCategory === selectedCategory;
    return yearMatch && categoryMatch;
  }), [items, selectedCategory, selectedYear]);

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
    <Main title="News" description="Learn about Menglin Zhu's news and updates.">
      <article className="post" id="news">
        <PageHeader title="News" titleActions={titleActions} />
        <PageTools items={NEWS_TOOLS} ariaLabel="News page tools" />
        <div className="filter-section job-filter-row" id="news-filters">
          <label htmlFor="news-year" className="job-filter-label">
            Year
            <select
              id="news-year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="job-filter-select news-filter-select"
            >
              <option value="all">All</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </label>
          <label htmlFor="news-category" className="job-filter-label">
            Category
            <select
              id="news-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="job-filter-select news-filter-select"
            >
              <option value="all">All</option>
              {availableCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => {
              setSelectedYear('all');
              setSelectedCategory('all');
            }}
            className="job-filter-clear"
          >
            Clear
          </button>
        </div>
        <div className="news-card-list">
          {filteredItems.map((badge) => (
            <AdaptiveCard
              data={badge}
              key={badge.label}
              cardId={badge.label}
              enableExpand={ENABLE_PER_CARD_EXPAND}
              bulkCommand={bulkCommand}
              onExpandedChange={handleExpandedChange}
              className="news-card"
            />
          ))}
        </div>
      </article>
    </Main>
  );
};

export default News;
