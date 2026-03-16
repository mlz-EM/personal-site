const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const LOOSE_DATE_PATTERN = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
const URL_PATTERN = /^(https?:\/\/|mailto:)/i;

/**
 * @typedef {Object} ProjectRecord
 * @property {string} title
 * @property {string} date
 * @property {string} image
 * @property {string} link
 * @property {string} summary
 * @property {boolean} expandable
 * @property {boolean} pinned
 */

/**
 * @typedef {Object} PublicationRecord
 * @property {string} title
 * @property {string[]} authors
 * @property {string} venue
 * @property {number} year
 * @property {string} url
 * @property {string[]} tags
 */

/**
 * @typedef {Object} MiscRecord
 * @property {string} label
 * @property {string} date
 * @property {string} image
 * @property {string} link
 * @property {boolean} expandable
 * @property {boolean} pinned
 */

/**
 * @typedef {Object} FeedItemRecord
 * @property {string} title
 * @property {string} date
 * @property {string} source
 * @property {string} url
 * @property {Object} metadata
 */

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const isValidUrl = (value) => isNonEmptyString(value) && URL_PATTERN.test(value.trim());

const normalizeDate = (value) => {
  if (!isNonEmptyString(value)) return null;
  const trimmed = value.trim();

  if (ISO_DATE_PATTERN.test(trimmed)) return trimmed;

  const looseMatch = trimmed.match(LOOSE_DATE_PATTERN);
  if (!looseMatch) return null;

  const [, year, month, day] = looseMatch;
  const normalized = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  return ISO_DATE_PATTERN.test(normalized) ? normalized : null;
};

export const compareIsoDateDesc = (a, b) => new Date(b).getTime() - new Date(a).getTime();

export const toProjectRecord = (record) => {
  const date = normalizeDate(record?.date);
  if (
    !isNonEmptyString(record?.title)
    || !date
    || !isNonEmptyString(record?.image)
    || !isNonEmptyString(record?.desc)
  ) {
    return null;
  }

  return {
    title: record.title.trim(),
    date,
    image: record.image.trim(),
    link: isValidUrl(record?.link) ? record.link.trim() : '',
    summary: record.desc.trim(),
    expandable: record?.expandable === true,
    pinned: record?.pinned === true,
  };
};

export const toPublicationRecord = (record) => {
  const year = Number(record?.year);
  const authors = Array.isArray(record?.authors)
    ? record.authors.filter(isNonEmptyString).map((name) => name.trim())
    : [];
  const tags = Array.isArray(record?.tags)
    ? record.tags.filter(isNonEmptyString).map((tag) => tag.trim())
    : [];

  if (
    !isNonEmptyString(record?.title)
    || !Number.isInteger(year)
    || year < 1900
    || year > 2100
    || authors.length === 0
    || !isNonEmptyString(record?.venue)
  ) {
    return null;
  }

  return {
    title: record.title.trim(),
    authors,
    venue: record.venue.trim(),
    year,
    url: isValidUrl(record?.url) ? record.url.trim() : '',
    tags,
  };
};

export const toMiscRecord = (record) => {
  const date = normalizeDate(record?.date);
  if (
    !isNonEmptyString(record?.label)
    || !date
    || !isNonEmptyString(record?.image)
    || !isValidUrl(record?.link)
  ) {
    return null;
  }

  return {
    label: record.label.trim(),
    date,
    image: record.image.trim(),
    link: record.link.trim(),
    expandable: record?.expandable === true,
    pinned: record?.pinned === true,
  };
};

export const toFeedItemRecord = (record) => {
  const date = normalizeDate(record?.date);
  if (
    !isNonEmptyString(record?.title)
    || !date
    || !isNonEmptyString(record?.source)
    || !isValidUrl(record?.url)
  ) {
    return null;
  }

  return {
    title: record.title.trim(),
    date,
    source: record.source.trim(),
    url: record.url.trim(),
    metadata: record?.metadata && typeof record.metadata === 'object' ? record.metadata : {},
  };
};

export const isIsoDateString = (value) => ISO_DATE_PATTERN.test(value);
export const isValidExternalUrl = (value) => isValidUrl(value);
