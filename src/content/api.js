import projectsData from '../data/projects';
import miscData from '../data/miscellaneous';
import publicationsData from '../data/publications';
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
    .sort((a, b) => compareIsoDateDesc(a.date, b.date))
);

export const getMiscItems = () => (
  miscData
    .map(toMiscRecord)
    .filter(Boolean)
    .sort((a, b) => compareIsoDateDesc(a.date, b.date))
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

export const parseJobsMarkdown = (markdown) => {
  if (!markdown) return { basicInfo: '', items: [] };

  const sections = markdown.split('---');
  const basicInfo = sections[0] || '';
  const items = sections
    .slice(1)
    .map((section) => {
      const lines = section.trim().split('\n').filter(Boolean);
      const titleLine = lines[0] || '';
      const titleMatch = titleLine.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (!titleMatch) return null;

      const rawTitle = titleMatch[1].trim();
      const isNew = /\[NEW\]/i.test(rawTitle) || /\[NEW\]/i.test(titleLine);
      const cleanedTitle = rawTitle.replace(/\[NEW\]\s*/gi, '').trim();
      const stars = (section.match(/🌟/g) || []).length;

      const details = lines.slice(1).reduce((acc, line) => {
        if (line.includes('**Location**:')) acc.location = line.split('**Location**:')[1].trim();
        if (line.includes('**Date**:')) acc.date = line.split('**Date**:')[1].trim();
        if (line.includes('**Description**:')) acc.description = line.split('**Description**:')[1].trim();
        if (line.includes('**Keyword**:')) acc.keyword = line.split('**Keyword**:')[1].trim();
        return acc;
      }, {
        location: '',
        date: '',
        description: '',
        keyword: '',
      });

      return toFeedItemRecord({
        title: cleanedTitle,
        date: details.date,
        source: 'TTAP Daily Feed',
        url: titleMatch[2].trim(),
        metadata: {
          stars,
          isNew,
          location: details.location,
          description: details.description,
          keyword: details.keyword,
        },
      });
    })
    .filter(Boolean);

  return { basicInfo, items };
};
