import {
  getArxivFeed,
  getFeaturedPinnedItems,
  getJobsFeed,
  getNewsItems,
  getProjects,
  getPublications,
} from '../content/api';

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
  });

  it('returns arxiv feed from JSON records', () => {
    const arxiv = getArxivFeed();
    expect(arxiv.items.length).toBeGreaterThan(0);
    expect(arxiv.items.every((item) => /^https?:\/\//.test(item.url))).toBe(true);
    expect(arxiv.items.some((item) => item.metadata.isNew)).toBe(true);
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
