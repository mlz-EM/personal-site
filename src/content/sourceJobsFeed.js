import { toFeedItemRecord } from './schema';

const buildSourceJobsFeed = (data, canonicalSource) => ({
  header: data?.header || null,
  generatedAt: data?.header?.generatedAt || data?.generatedAt || '',
  source: canonicalSource,
  items: (Array.isArray(data?.items) ? data.items : [])
    .map((item) => toFeedItemRecord({
      title: item?.title,
      date: item?.date,
      source: canonicalSource,
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

export default buildSourceJobsFeed;
