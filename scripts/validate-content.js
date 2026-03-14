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

const validateMarkdownDateLines = (file) => {
  const content = read(file);
  const lines = content.split('\n').filter((line) => line.includes('- **Date**:'));
  lines.forEach((line) => {
    const value = line.split('- **Date**:')[1].trim();
    if (!ISO_DATE.test(value)) {
      errors.push(`${file}: invalid markdown date "${value}"`);
    }
  });
};

validateDateLiterals('src/data/projects.js');
validateDateLiterals('src/data/miscellaneous.js');
validateUrlLiterals('src/data/projects.js');
validateUrlLiterals('src/data/miscellaneous.js');
validateUrlLiterals('src/data/publications.js', 'url', true);
validateMarkdownDateLines('src/data/jobsDaily.md');
validateMarkdownDateLines('src/data/arXivDaily.md');

if (errors.length > 0) {
  process.stderr.write(`Content validation failed with ${errors.length} error(s):\n`);
  errors.forEach((error) => process.stderr.write(`- ${error}\n`));
  process.exit(1);
}

process.stdout.write('Content validation passed.\n');
