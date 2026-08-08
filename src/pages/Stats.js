import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import Main from '../layouts/Main';
import PageHeader from '../components/Template/PageHeader';

const API_URL = (process.env.REACT_APP_VISITOR_MAP_API_URL || '').replace(/\/$/, '');
const EMPTY_TREND = Array.from({ length: 90 }, (_, index) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - (89 - index));
  return { date: date.toISOString(), visits: 0 };
});
const EMPTY_STATS = {
  summary: {
    today: 0,
    sevenDays: 0,
    lastMonth: 0,
    allTime: 0,
  },
  trend: EMPTY_TREND,
  paths: [],
  recentVisits: [],
};

const SUMMARY_ITEMS = [
  { key: 'today', label: 'Today' },
  { key: 'sevenDays', label: 'Last 7 days' },
  { key: 'lastMonth', label: 'Last month' },
  { key: 'allTime', label: 'All time' },
];

const formatCount = (value) => new Intl.NumberFormat('en-US').format(value);

const formatChartDate = (value) => new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
}).format(new Date(value));

const formatTooltipDate = (value) => new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
}).format(new Date(value));

const formatVisitTime = (value) => {
  const elapsedMinutes = Math.max(1, Math.round((Date.now() - Date.parse(value)) / 60000));
  if (elapsedMinutes < 60) return `${elapsedMinutes} min ago`;

  const elapsedHours = Math.round(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours} hr ago`;

  const elapsedDays = Math.round(elapsedHours / 24);
  return `${elapsedDays} day${elapsedDays === 1 ? '' : 's'} ago`;
};

const chartLabelAnchor = (index, finalIndex) => {
  if (index === 0) return 'start';
  if (index === finalIndex) return 'end';
  return 'middle';
};

const normalizeStats = (payload) => ({
  summary: {
    ...EMPTY_STATS.summary,
    ...(payload && payload.summary ? payload.summary : {}),
  },
  trend: Array.isArray(payload && payload.trend) && payload.trend.length > 0
    ? payload.trend
    : EMPTY_STATS.trend,
  paths: Array.isArray(payload && payload.paths) ? payload.paths : EMPTY_STATS.paths,
  recentVisits: Array.isArray(payload && payload.recentVisits)
    ? payload.recentVisits
    : EMPTY_STATS.recentVisits,
});

const TrendChart = ({ points }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const width = 760;
  const height = 176;
  const padding = {
    top: 14,
    right: 10,
    bottom: 27,
    left: 27,
  };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const maximum = Math.max(1, ...points.map((point) => point.visits));
  const coordinates = points.map((point, index) => ({
    x: padding.left + (index / Math.max(1, points.length - 1)) * chartWidth,
    y: padding.top + chartHeight - (point.visits / maximum) * chartHeight,
  }));
  const linePath = coordinates
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');
  const areaPath = coordinates.length > 0
    ? `${linePath} L ${coordinates[coordinates.length - 1].x} ${padding.top + chartHeight}`
      + ` L ${coordinates[0].x} ${padding.top + chartHeight} Z`
    : '';
  const labelIndexes = [0, Math.floor((points.length - 1) / 2), points.length - 1];
  const activePoint = activeIndex === null ? null : coordinates[activeIndex];
  const activeDatum = activeIndex === null ? null : points[activeIndex];
  const tooltipWidth = 116;
  const tooltipHeight = 42;
  const tooltipX = activePoint
    ? Math.min(
      width - padding.right - tooltipWidth,
      Math.max(padding.left, activePoint.x + (activePoint.x > width * 0.7 ? -124 : 8)),
    )
    : 0;
  const tooltipY = activePoint
    ? Math.max(padding.top, activePoint.y - tooltipHeight - 8)
    : 0;

  const updateActivePoint = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    if (!bounds.width || points.length === 0) return;

    const pointerX = ((event.clientX - bounds.left) / bounds.width) * width;
    const chartRatio = Math.min(1, Math.max(0, (pointerX - padding.left) / chartWidth));
    setActiveIndex(Math.round(chartRatio * (points.length - 1)));
  };

  return (
    <svg
      className="stats-trend-chart"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Daily visits from ${formatChartDate(points[0].date)} to ${formatChartDate(points[points.length - 1].date)}`}
      onMouseMove={updateActivePoint}
      onMouseLeave={() => setActiveIndex(null)}
    >
      {[0, 0.5, 1].map((ratio) => {
        const y = padding.top + chartHeight - ratio * chartHeight;
        return (
          <g key={ratio}>
            <line
              className="stats-chart-gridline"
              x1={padding.left}
              x2={padding.left + chartWidth}
              y1={y}
              y2={y}
            />
            <text className="stats-chart-axis-label" x={padding.left - 9} y={y + 4}>
              {Math.round(maximum * ratio)}
            </text>
          </g>
        );
      })}
      <path className="stats-chart-area" d={areaPath} />
      <path className="stats-chart-line" d={linePath} />
      {activePoint && activeDatum ? (
        <g className="stats-chart-hover" aria-hidden="true">
          <line
            className="stats-chart-crosshair"
            x1={activePoint.x}
            x2={activePoint.x}
            y1={padding.top}
            y2={padding.top + chartHeight}
          />
          <line
            className="stats-chart-crosshair"
            x1={padding.left}
            x2={padding.left + chartWidth}
            y1={activePoint.y}
            y2={activePoint.y}
          />
          <circle
            className="stats-chart-active-point"
            cx={activePoint.x}
            cy={activePoint.y}
            r="3.5"
          />
          <rect
            className="stats-chart-tooltip-bg"
            x={tooltipX}
            y={tooltipY}
            width={tooltipWidth}
            height={tooltipHeight}
            rx="2"
          />
          <text
            className="stats-chart-tooltip-date"
            x={tooltipX + 8}
            y={tooltipY + 16}
          >
            {formatTooltipDate(activeDatum.date)}
          </text>
          <text
            className="stats-chart-tooltip-value"
            x={tooltipX + 8}
            y={tooltipY + 32}
          >
            {formatCount(activeDatum.visits)} {activeDatum.visits === 1 ? 'visit' : 'visits'}
          </text>
        </g>
      ) : null}
      {labelIndexes.map((index) => (
        <text
          key={points[index].date}
          className="stats-chart-date-label"
          x={coordinates[index].x}
          y={height - 6}
          textAnchor={chartLabelAnchor(index, points.length - 1)}
        >
          {formatChartDate(points[index].date)}
        </text>
      ))}
    </svg>
  );
};

TrendChart.propTypes = {
  points: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string.isRequired,
    visits: PropTypes.number.isRequired,
  })).isRequired,
};

const Stats = () => {
  const [stats, setStats] = useState(EMPTY_STATS);
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

  useEffect(() => {
    if (!API_URL || navigator.userAgent === 'ReactSnap') return undefined;

    const controller = new AbortController();
    fetch(`${API_URL}/stats`, {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Visitor statistics request failed: ${response.status}`);
        return response.json();
      })
      .then((payload) => setStats(normalizeStats(payload)))
      .catch(() => {
        // Keep zeroed statistics when the live endpoint is unavailable.
      });

    return () => controller.abort();
  }, []);

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
