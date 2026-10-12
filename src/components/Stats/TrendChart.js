import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { formatCount, formatChartDate, formatTooltipDate } from '../../utils/statsFormatting';

const chartLabelAnchor = (index, finalIndex) => {
  if (index === 0) return 'start';
  if (index === finalIndex) return 'end';
  return 'middle';
};

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

export default TrendChart;
