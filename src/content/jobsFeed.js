import jobsDailyData from '../data/jobsDaily.json';
import { toFeedItemRecord } from './schema';

// Keep this feed isolated so its JSON is loaded only with the jobs route.
const getJobsFeed = () => ({
  header: jobsDailyData?.header || null,
  generatedAt: jobsDailyData?.header?.generatedAt || jobsDailyData?.generatedAt || '',
  source: jobsDailyData?.header?.source || jobsDailyData?.source || 'TTAP Daily Feed',
  items: (Array.isArray(jobsDailyData?.items) ? jobsDailyData.items : [])
    .map((item) => toFeedItemRecord({
      title: item?.title,
      date: item?.date,
      source: jobsDailyData?.header?.source || jobsDailyData?.source || 'TTAP Daily Feed',
      url: item?.url,
      metadata: {
        id: item?.id || '',
        stars: Number.isInteger(item?.fitScore) ? item.fitScore : 0,
        isNew: item?.isNew === true,
        location: item?.location || '',
        description: item?.description || '',
        keyword: Array.isArray(item?.keywords) ? item.keywords.join(', ') : '',
      },
    }))
    .filter(Boolean),
});

export default getJobsFeed;
