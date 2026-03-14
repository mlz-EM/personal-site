import {
  getMiscItems,
  getProjects,
  getPublications,
  parseJobsMarkdown,
} from '../content/api';

describe('content API', () => {
  it('returns projects sorted by descending date', () => {
    const projects = getProjects();
    expect(projects.length).toBeGreaterThan(0);

    const timestamps = projects.map((item) => new Date(item.date).getTime());
    const sorted = [...timestamps].sort((a, b) => b - a);
    expect(timestamps).toEqual(sorted);
  });

  it('returns validated misc and publication collections', () => {
    const misc = getMiscItems();
    const publications = getPublications();

    expect(misc.every((item) => /^https?:\/\//.test(item.link))).toBe(true);
    expect(publications.every((item) => Number.isInteger(item.year))).toBe(true);
    expect(publications.every((item) => item.authors.length > 0)).toBe(true);
  });

  it('parses jobs markdown into feed records', () => {
    const markdown = `
# Basic Info
Generated feed.
---
**[NEW] [Assistant Professor](https://example.com/jobs/1)** 🌟🌟
- **Location**: Boston, MA
- **Date**: 2026-03-10
- **Description**: Faculty opening in materials science.
`;

    const parsed = parseJobsMarkdown(markdown);
    expect(parsed.basicInfo).toContain('Basic Info');
    expect(parsed.items).toHaveLength(1);
    expect(parsed.items[0].title).toBe('Assistant Professor');
    expect(parsed.items[0].metadata.stars).toBe(2);
  });
});
