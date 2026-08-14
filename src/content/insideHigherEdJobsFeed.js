import insideHigherEdJobsData from '../data/insideHigherEdJobsSummary.json';
import buildSourceJobsFeed from './sourceJobsFeed';

const getInsideHigherEdJobsFeed = () => buildSourceJobsFeed(
  insideHigherEdJobsData,
  'Inside Higher Ed Faculty Jobs',
);

export default getInsideHigherEdJobsFeed;
