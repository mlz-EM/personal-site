import jobsDailyData from '../data/jobsDaily.json';
import getFacultyJobsFeed from './facultyJobsFeed';
import buildSourceJobsFeed from './sourceJobsFeed';
import { compareIsoDateDesc } from './schema';

// Keep this feed isolated so its JSON is loaded only with the jobs route.
const getJobsFeed = () => {
  const feeds = [
    buildSourceJobsFeed(jobsDailyData, 'TTAP Daily Feed'),
    getFacultyJobsFeed(),
  ];
  const byUrl = new Map();
  feeds.forEach((feed) => {
    feed.items.forEach((item) => {
      const previous = byUrl.get(item.url);
      if (!previous || compareIsoDateDesc(item.date, previous.date) < 0) {
        byUrl.set(item.url, item);
      }
    });
  });
  const generatedAt = feeds.map((feed) => feed.generatedAt).filter(Boolean)
    .sort((a, b) => new Date(b) - new Date(a))[0] || '';
  const models = [...new Set(feeds.flatMap((feed) => (
    feed.header?.model ? feed.header.model.split(', ') : []
  )))];

  return {
    header: {
      title: 'Basic Info',
      model: models.join(', '),
      generatedAt,
      source: 'Faculty Jobs',
      notes: [
        'This report combines AI-filtered faculty job feeds from Google, LinkedIn, Indeed, Interfolio, The Chronicle of Higher Education Jobs, and Inside Higher Ed Careers.',
        'This page is powered by [ArxivSummaryDaily](https://github.com/dong-zehao/ArxivSummaryDaily) and [JobSpy](https://github.com/speedyapply/JobSpy).',
      ],
    },
    generatedAt,
    source: 'Faculty Jobs',
    items: [...byUrl.values()].sort((a, b) => compareIsoDateDesc(a.date, b.date)),
  };
};

export default getJobsFeed;
