import chronicleJobsData from '../data/chronicleJobsSummary.json';
import buildSourceJobsFeed from './sourceJobsFeed';

// Keep this feed isolated so its JSON is loaded only with the direct Chronicle route.
const getChronicleJobsFeed = () => buildSourceJobsFeed(
  chronicleJobsData,
  'Chronicle Faculty Jobs',
);

export default getChronicleJobsFeed;
