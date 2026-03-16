import projectsData from '../data/projects';
import miscData from '../data/miscellaneous';
import publicationsData from '../data/publications';
import jobsDailyData from '../data/jobsDaily.json';
import arXivDailyData from '../data/arXivDaily.json';
import {
  compareIsoDateDesc,
  toProjectRecord,
  toPublicationRecord,
  toMiscRecord,
  toFeedItemRecord,
} from './schema';

export const getProjects = () => (
  projectsData
    .map(toProjectRecord)
    .filter(Boolean)
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return compareIsoDateDesc(a.date, b.date);
    })
);

export const getMiscItems = () => (
  miscData
    .map(toMiscRecord)
    .filter(Boolean)
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return compareIsoDateDesc(a.date, b.date);
    })
);

export const getFeaturedPinnedItems = () => (
  [...getProjects(), ...getMiscItems()]
    .filter((item) => item.pinned && item.link)
    .sort((a, b) => compareIsoDateDesc(a.date, b.date))
    .map((item) => ({
      title: item.title || item.label,
      date: item.date,
      url: item.link,
    }))
);

export const getPublications = () => (
  publicationsData
    .map(toPublicationRecord)
    .filter(Boolean)
    .sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year;
      return a.title.localeCompare(b.title);
    })
);

export const getPublicationYears = () => (
  [...new Set(getPublications().map((entry) => entry.year))]
    .sort((a, b) => b - a)
);

export const getPublicationTags = () => (
  [...new Set(getPublications().flatMap((entry) => entry.tags))]
    .sort((a, b) => a.localeCompare(b))
);

export const getJobsFeed = () => ({
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

export const getArxivFeed = () => {
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
