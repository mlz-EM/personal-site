import React, { useMemo } from 'react';
import Main from '../layouts/Main';
import PageHeader from '../components/Template/PageHeader';
import TrendChart from '../components/Stats/TrendChart';
import useVisitorStats from '../hooks/useVisitorStats';
import { formatCount, formatVisitTime } from '../utils/statsFormatting';

const SUMMARY_ITEMS = [
  { key: 'today', label: 'Today' },
  { key: 'sevenDays', label: 'Last 7 days' },
  { key: 'lastMonth', label: 'Last month' },
  { key: 'allTime', label: 'All time' },
];

const Stats = () => {
  const stats = useVisitorStats();
  const trend = useMemo(
    () => stats.trend.slice(-90),
    [stats.trend],
  );
  const popularPaths = useMemo(
    () => [...stats.paths]
      .sort((first, second) => second.visits - first.visits)
      .slice(0, 3),
    [stats.paths],
  );
  const maximumPathVisits = Math.max(
    1,
    ...popularPaths.map((path) => path.visits),
  );

  return (
    <Main title="Statistics" description="Anonymous visitor statistics for Menglin Zhu's website">
      <article className="post stats-page" id="stats">
        <PageHeader title="Statistics" />

        <section className="stats-panel stats-overview" aria-labelledby="visits-trend-title">
          <div className="stats-trend-column">
            <div className="stats-panel-heading">
              <div>
                <h3 id="visits-trend-title">Visits over time</h3>
              </div>
            </div>
            <TrendChart points={trend} />
          </div>
          <div className="stats-summary-grid" aria-label="Visit summary">
            {SUMMARY_ITEMS.map((item) => (
              <div className="stats-summary-card" key={item.key}>
                <span className="stats-summary-label">{item.label}</span>
                <strong className="stats-summary-value">
                  {formatCount(stats.summary[item.key])}
                </strong>
              </div>
            ))}
          </div>
        </section>

        <section className="stats-panel" aria-labelledby="popular-paths-title">
          <div className="stats-panel-heading">
            <div>
              <h3 id="popular-paths-title">Popular paths</h3>
            </div>
          </div>
          <div className="stats-path-chart" aria-labelledby="popular-paths-title">
            {popularPaths.map((item) => {
              const width = `${(item.visits / maximumPathVisits) * 100}%`;

              return (
                <div className="stats-path-row" key={item.path}>
                  <span className="stats-path-label" title={item.path}>{item.path}</span>
                  <span className="stats-path-track" aria-hidden="true">
                    <span className="stats-path-bar" style={{ width }} />
                  </span>
                  <strong>{formatCount(item.visits)}</strong>
                </div>
              );
            })}
          </div>
        </section>

        <section className="stats-panel" aria-labelledby="recent-visits-title">
          <div className="stats-panel-heading">
            <div>
              <h3 id="recent-visits-title">Recent visits</h3>
            </div>
          </div>
          <div className="stats-recent-list" role="table" aria-label="Latest ten visits">
            <div className="stats-recent-header" role="row">
              <span role="columnheader">Location</span>
              <span role="columnheader">Time</span>
            </div>
            {stats.recentVisits.slice(0, 10).map((visit, index) => (
              <div
                className="stats-recent-row"
                role="row"
                key={`${visit.city}-${visit.country}-${visit.visitedAt}`}
              >
                <span className="stats-location" role="cell">
                  <span className="stats-location-index">{String(index + 1).padStart(2, '0')}</span>
                  <strong>{visit.city}, {visit.country}</strong>
                </span>
                <time role="cell" dateTime={visit.visitedAt} title={new Date(visit.visitedAt).toLocaleString()}>
                  {formatVisitTime(visit.visitedAt)}
                </time>
              </div>
            ))}
          </div>
        </section>

      </article>
    </Main>
  );
};

export default Stats;
