import projectsData from '../data/projects';
import newsData from '../data/news';
import publicationsData from '../data/publications';
import {
  compareIsoDateDesc,
  toProjectRecord,
  toPublicationRecord,
  toMiscRecord,
} from './schema';

export const getProjects = () => (
  projectsData
    .map(toProjectRecord)
    .filter(Boolean)
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return compareIsoDateDesc(a.date, b.date);
    })
);

export const getNewsItems = () => (
  newsData
    .map(toMiscRecord)
    .filter(Boolean)
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return compareIsoDateDesc(a.date, b.date);
    })
);

export const getFeaturedPinnedItems = () => (
  [...getProjects(), ...getNewsItems()]
    .filter((item) => item.pinned && item.link)
    .sort((a, b) => compareIsoDateDesc(a.date, b.date))
    .map((item) => ({
      title: item.title || item.label,
      date: item.date,
      url: item.link,
    }))
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
