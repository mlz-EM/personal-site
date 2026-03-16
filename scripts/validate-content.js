const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const URL = /^(https?:\/\/|mailto:)/i;

const errors = [];

const read = (file) => fs.readFileSync(path.join(ROOT, file), 'utf8');

const validateDateLiterals = (file, prefix = 'date') => {
  const content = read(file);
  const pattern = new RegExp(`${prefix}:\\s*'([^']+)'`, 'g');
  let match = pattern.exec(content);
  while (match) {
    if (!ISO_DATE.test(match[1])) {
      errors.push(`${file}: invalid ${prefix} "${match[1]}" (expected YYYY-MM-DD)`);
    }
    match = pattern.exec(content);
  }
};

const validateUrlLiterals = (file, key = 'link', allowEmpty = false) => {
  const content = read(file);
  const pattern = new RegExp(`${key}:\\s*'([^']*)'`, 'g');
  let match = pattern.exec(content);
  while (match) {
    const value = match[1].trim();
    const canSkip = (!value && allowEmpty) || value === 'TBD';
    if (!canSkip && !URL.test(value)) {
      errors.push(`${file}: invalid ${key} "${value}" (expected http(s) or mailto)`);
    }
    match = pattern.exec(content);
  }
};

const readJson = (file) => JSON.parse(read(file));

const validateFeedJson = (file, options = {}) => {
  const {
    requireIsNew = false,
    requireFitScore = false,
    allowEmptyDate = false,
  } = options;

  const data = readJson(file);
  if (!data || typeof data !== 'object') {
    errors.push(`${file}: expected JSON object`);
    return;
  }

  const items = Array.isArray(data.items) ? data.items : [];
  items.forEach((item, index) => {
    const label = `${file}: items[${index}]`;
    const dateValue = String(item?.date || '').trim();
    if (!allowEmptyDate && !ISO_DATE.test(dateValue)) {
      errors.push(`${label}: invalid date "${item?.date}" (expected YYYY-MM-DD)`);
    } else if (allowEmptyDate && dateValue && !ISO_DATE.test(dateValue)) {
      errors.push(`${label}: invalid date "${item?.date}" (expected YYYY-MM-DD)`);
    }
    if (!URL.test(String(item?.url || '').trim())) {
      errors.push(`${label}: invalid url "${item?.url}" (expected http(s))`);
    }
    if (requireIsNew && typeof item?.isNew !== 'boolean') {
      errors.push(`${label}: missing/invalid isNew boolean`);
    }
    if (requireFitScore && !Number.isInteger(item?.fitScore)) {
      errors.push(`${label}: missing/invalid fitScore integer`);
    }
  });
};

validateDateLiterals('src/data/projects.js');
validateDateLiterals('src/data/miscellaneous.js');
validateUrlLiterals('src/data/projects.js');
validateUrlLiterals('src/data/miscellaneous.js');
validateUrlLiterals('src/data/publications.js', 'url', true);
validateFeedJson('src/data/jobsDaily.json', {
  requireIsNew: true,
  requireFitScore: true,
  allowEmptyDate: true,
});
validateFeedJson('src/data/arXivDaily.json');

if (errors.length > 0) {
  process.stderr.write(`Content validation failed with ${errors.length} error(s):\n`);
  errors.forEach((error) => process.stderr.write(`- ${error}\n`));
  process.exit(1);
}

process.stdout.write('Content validation passed.\n');
