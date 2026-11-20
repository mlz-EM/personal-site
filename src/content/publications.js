import paperpile from '../data/paperpile.json';

const ownerName = /^(?:(?:Menglin|M\.?)\s+Zhu|Zhu,\s*(?:Menglin|M\.?))$/i;
const normalizeSearch = (text) => text.normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '').toLowerCase();

const parseAuthor = (author, position) => {
  const annotated = author.replace(/∗/g, '*');
  const name = annotated.replace(/[*#]/g, '').trim();
  return {
    name,
    position,
    isOwner: ownerName.test(name),
    equalContributor: annotated.includes('*'),
    corresponding: annotated.includes('#'),
  };
};

const papers = paperpile.publications.map((paper) => {
  const year = String(paper.year || 'Undated');
  const authors = paper.authors.map(parseAuthor);
  // Some Paperpile venue fields include citation details or an arXiv subject.
  const journal = (paper.venue || '').trim()
    .replace(/\s+(?:19|20)\d{2}\s+\d+:\d+$/, '')
    .replace(/^arXiv\s+\[.+\]$/i, 'arXiv');
  const titleText = paper.title.replace(/<\/?(?:sub|sup|i|b)>/g, '');
  const searchText = normalizeSearch([
    titleText, ...authors.map((author) => author.name), journal, year,
  ].join(' '));
  return {
    ...paper, year, authors, journal, searchText,
  };
});

export const publicationCount = papers.length;

const papersByYear = new Map();
papers.forEach((paper) => {
  if (!papersByYear.has(paper.year)) papersByYear.set(paper.year, []);
  papersByYear.get(paper.year).push(paper);
});
const groups = Array.from(papersByYear, ([year, entries]) => ({ year, papers: entries }))
  .sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0));
const datedYears = groups.map(({ year }) => year).filter((year) => year !== 'Undated');
const [latestYear] = datedYears;
const earliestYear = datedYears[datedYears.length - 1];
export const publicationPeriod = earliestYear && earliestYear !== latestYear
  ? ` from ${earliestYear} to ${latestYear}` : (latestYear && ` in ${latestYear}`) || '';

export const getPublicationGroups = (query) => {
  const terms = normalizeSearch(query).trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return groups;
  return groups.map(({ year, papers: entries }) => ({
    year,
    papers: entries.filter((paper) => terms.every((term) => paper.searchText.includes(term))),
  })).filter((group) => group.papers.length > 0);
};
