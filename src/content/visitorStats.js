const EMPTY_TREND = Array.from({ length: 90 }, (_, index) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - (89 - index));
  return { date: date.toISOString(), visits: 0 };
});
export const EMPTY_STATS = {
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

export const normalizeStats = (payload) => ({
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
