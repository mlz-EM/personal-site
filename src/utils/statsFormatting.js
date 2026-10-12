export const formatCount = (value) => new Intl.NumberFormat('en-US').format(value);

export const formatChartDate = (value) => new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
}).format(new Date(value));

export const formatTooltipDate = (value) => new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
}).format(new Date(value));

export const formatVisitTime = (value) => {
  const elapsedMinutes = Math.max(1, Math.round((Date.now() - Date.parse(value)) / 60000));
  if (elapsedMinutes < 60) return `${elapsedMinutes} min ago`;

  const elapsedHours = Math.round(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours} hr ago`;

  const elapsedDays = Math.round(elapsedHours / 24);
  return `${elapsedDays} day${elapsedDays === 1 ? '' : 's'} ago`;
};
