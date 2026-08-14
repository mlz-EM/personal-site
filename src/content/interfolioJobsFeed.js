import interfolioJobsData from '../data/interfolioJobsSummary.json';
import buildSourceJobsFeed from './sourceJobsFeed';

// Keep this feed isolated so its JSON is loaded only with the direct Interfolio route.
const getInterfolioJobsFeed = () => buildSourceJobsFeed(
  interfolioJobsData,
  'Interfolio Faculty Jobs',
);

export default getInterfolioJobsFeed;
