import {
  getFeaturedPinnedItems,
  getNewsItems,
  getProjects,
  getPublications,
} from '../content/api';
import getArxivFeed from '../content/arxivFeed';
import getJobsFeed from '../content/jobsFeed';
import getInterfolioJobsFeed from '../content/interfolioJobsFeed';
import getChronicleJobsFeed from '../content/chronicleJobsFeed';
import getInsideHigherEdJobsFeed from '../content/insideHigherEdJobsFeed';
import getFacultyJobsFeed from '../content/facultyJobsFeed';

describe('content API', () => {
  it('returns projects sorted by descending date', () => {
    const projects = getProjects();
    expect(projects.length).toBeGreaterThan(0);

    const firstUnpinnedIndex = projects.findIndex((item) => !item.pinned);
    if (firstUnpinnedIndex !== -1) {
      expect(projects.slice(0, firstUnpinnedIndex).every((item) => item.pinned)).toBe(true);
      expect(projects.slice(firstUnpinnedIndex).every((item) => !item.pinned)).toBe(true);
    }
  });

  it('returns validated news and publication collections', () => {
    const news = getNewsItems();
    const publications = getPublications();

    expect(news.every((item) => /^https?:\/\//.test(item.link))).toBe(true);
    expect(publications.every((item) => Number.isInteger(item.year))).toBe(true);
    expect(publications.every((item) => item.authors.length > 0)).toBe(true);
  });

  it('returns jobs feed from JSON records', () => {
    const jobs = getJobsFeed();
    expect(jobs.items.length).toBeGreaterThan(0);
    expect(jobs.items.every((item) => /^https?:\/\//.test(item.url))).toBe(true);
    expect(jobs.items.every((item) => Number.isInteger(item.metadata.stars))).toBe(true);
    expect(new Set(jobs.items.map((item) => item.url)).size).toBe(jobs.items.length);
  });

  it('returns arxiv feed from JSON records', () => {
    const arxiv = getArxivFeed();
    expect(arxiv.items.length).toBeGreaterThan(0);
    expect(arxiv.items.every((item) => /^https?:\/\//.test(item.url))).toBe(true);
    expect(arxiv.items.some((item) => item.metadata.isNew)).toBe(true);
  });

  it('returns the independent Interfolio feed', () => {
    const interfolio = getInterfolioJobsFeed();
    expect(interfolio.header.model).toEqual(expect.any(String));
    expect(interfolio.source).toBe('Interfolio Faculty Jobs');
    expect(Array.isArray(interfolio.items)).toBe(true);
  });

  it('returns the independent Chronicle feed', () => {
    const chronicle = getChronicleJobsFeed();
    expect(chronicle.header.model).toEqual(expect.any(String));
    expect(chronicle.source).toBe('Chronicle Faculty Jobs');
    expect(Array.isArray(chronicle.items)).toBe(true);
  });

  it('returns the independent Inside Higher Ed feed', () => {
    const insideHigherEd = getInsideHigherEdJobsFeed();
    expect(insideHigherEd.header.model).toEqual(expect.any(String));
    expect(insideHigherEd.source).toBe('Inside Higher Ed Faculty Jobs');
    expect(Array.isArray(insideHigherEd.items)).toBe(true);
  });

  it('combines all three faculty job feeds with source choices', () => {
    const facultyJobs = getFacultyJobsFeed();
    expect(facultyJobs.source).toBe('Faculty Jobs');
    expect(facultyJobs.sources).toEqual([
      'Interfolio Faculty Jobs',
      'Chronicle Faculty Jobs',
      'Inside Higher Ed Faculty Jobs',
    ]);
    expect(facultyJobs.items.every((item) => facultyJobs.sources.includes(item.source))).toBe(true);
  });

  it('returns featured feed from pinned project and news items', () => {
    const featured = getFeaturedPinnedItems();
    expect(featured.length).toBeGreaterThan(0);
    expect(featured.every((item) => /^https?:\/\//.test(item.url))).toBe(true);

    const timestamps = featured.map((item) => new Date(item.date).getTime());
    const sorted = [...timestamps].sort((a, b) => b - a);
    expect(timestamps).toEqual(sorted);
  });
});
