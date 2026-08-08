import arXivDailyData from '../data/arXivDaily.json';
import { toFeedItemRecord } from './schema';

// Keep this feed isolated so its JSON is loaded only with the arXiv route.
const getArxivFeed = () => {
  const sourceItems = Array.isArray(arXivDailyData?.items) ? arXivDailyData.items : [];
  const latestDate = sourceItems.reduce((max, item) => (
    item?.date && (!max || item.date > max) ? item.date : max
  ), '');

  return {
    header: arXivDailyData?.header || null,
    generatedAt: arXivDailyData?.header?.generatedAt || arXivDailyData?.generatedAt || '',
    source: arXivDailyData?.header?.source || arXivDailyData?.source || 'arXiv Daily Feed',
    items: sourceItems
      .map((item) => toFeedItemRecord({
        title: item?.title,
        date: item?.date,
        source: arXivDailyData?.header?.source || arXivDailyData?.source || 'arXiv Daily Feed',
        url: item?.url,
        metadata: {
          id: item?.id || '',
          summary: item?.summary || '',
          tags: Array.isArray(item?.tags) ? item.tags : [],
          isNew: item?.date === latestDate,
        },
      }))
      .filter(Boolean),
  };
};

export default getArxivFeed;
