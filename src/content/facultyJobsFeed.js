import getChronicleJobsFeed from './chronicleJobsFeed';
import getInsideHigherEdJobsFeed from './insideHigherEdJobsFeed';
import getInterfolioJobsFeed from './interfolioJobsFeed';
import { compareIsoDateDesc } from './schema';

const SOURCE_NAMES = [
  'Interfolio Faculty Jobs',
  'Chronicle Faculty Jobs',
  'Inside Higher Ed Faculty Jobs',
];

const getFacultyJobsFeed = () => {
  const feeds = [
    getInterfolioJobsFeed(),
    getChronicleJobsFeed(),
    getInsideHigherEdJobsFeed(),
  ];
  const byUrl = new Map();
  feeds.forEach((feed) => {
    feed.items.forEach((item) => byUrl.set(item.url, item));
  });
  const generatedValues = feeds
    .map((feed) => feed.generatedAt)
    .filter(Boolean)
    .sort();
  const latestGeneratedAt = generatedValues[generatedValues.length - 1] || '';

  return {
    header: {
      title: 'Basic Info',
      model: feeds.find((feed) => feed.header?.model)?.header?.model || 'gemini-3.6-flash',
      generatedAt: latestGeneratedAt,
      source: 'Faculty Jobs',
      notes: [
        'This report combines independent AI-filtered feeds from Interfolio, The Chronicle of Higher Education Jobs, and Inside Higher Ed Careers.',
        'Use the Source filter to show one job board or leave it set to All.',
      ],
    },
    generatedAt: latestGeneratedAt,
    source: 'Faculty Jobs',
    sources: SOURCE_NAMES,
    items: [...byUrl.values()].sort((a, b) => compareIsoDateDesc(a.date, b.date)),
  };
};

export default getFacultyJobsFeed;
