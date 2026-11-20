/* eslint import/no-extraneous-dependencies: ["error", { "devDependencies": true }] */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { plugins } = require('@citation-js/core');
require('@citation-js/plugin-bibtex');

const source = 'https://paperpile.com/eb/zPzVarTdyN/paperpile.bib';
const destination = path.join(__dirname, '../src/data/paperpile.json');

const authorName = (name) => name.literal || [
  name.given, name['dropping-particle'], name['non-dropping-particle'], name.family, name.suffix,
].filter(Boolean).join(' ');

const arxivLink = ({ eprint, eprinttype, archiveprefix }) => {
  const archive = eprinttype || archiveprefix;
  if (archive && String(archive).toLowerCase() !== 'arxiv') return '';
  const id = String(eprint || '').replace(/^arxiv:\s*/i, '');
  return /^(?:\d{4}\.\d{4,5}|[a-z.-]+\/\d{7})(?:v\d+)?$/i.test(id)
    ? `https://arxiv.org/abs/${id}` : '';
};

const parsePublications = (bibtex) => {
  const entries = plugins.input.data(bibtex, '@biblatex/text');
  if (!entries.length) throw new Error('The Paperpile export contains no BibTeX records.');
  const byKey = new Map(entries.map((entry) => [entry.label, entry]));
  if (byKey.size !== entries.length) throw new Error('Duplicate Paperpile citation key.');

  // Decode author hashes before CSL splits names so an escaped hash cannot absorb the next author.
  entries.forEach((entry) => {
    const { properties } = entry;
    if (properties.author) properties.author = properties.author.replace(/\\#/g, '#');
  });

  // CSL supplies decoded titles and names. The BibTeX fields also carry arXiv identifiers.
  const citations = plugins.input.data(entries, '@biblatex/entries+list');
  return citations.map((citation) => {
    const entry = byKey.get(citation.id);
    const arxiv = arxivLink(entry.properties);
    const doi = (citation.DOI || '').replace(/^(?:https?:\/\/(?:dx\.)?doi\.org\/|doi:\s*)/i, '');
    const doiUrl = /^10\.\d{4,9}\/\S+$/i.test(doi) ? `https://doi.org/${doi}` : '';
    const url = /^https?:\/\//i.test(citation.URL) ? citation.URL : '';
    return {
      id: entry.label,
      title: citation.title || entry.label,
      authors: (citation.author || citation.editor || []).map(authorName),
      year: citation.issued?.['date-parts']?.[0]?.[0] || null,
      venue: citation['container-title'] || (arxiv ? 'arXiv' : citation.publisher || ''),
      volume: citation.volume || '',
      issue: citation.issue || '',
      pages: (citation.page || '').replace(/(\d)-(\d)/g, '$1–$2'),
      url: doiUrl || url || arxiv,
      arxiv,
    };
  });
};

const syncPublications = () => {
  let publications;
  try {
    const bibtex = execFileSync('curl', [
      '--fail', '--silent', '--show-error', '--location', '--max-time', '20', '--retry', '2', source,
    ], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
    publications = parsePublications(bibtex);
  } catch (error) {
    if (!process.argv.includes('--use-saved-on-error')) throw error;
    const saved = JSON.parse(fs.readFileSync(destination, 'utf8'));
    if (saved.source !== source || !Array.isArray(saved.publications)
      || saved.publications.length === 0) {
      throw error;
    }
    console.warn(`Paperpile refresh failed. Using ${saved.publications.length} saved records. ${error.message}`);
    return;
  }
  const temp = `${destination}.${process.pid}.tmp`;
  try {
    fs.writeFileSync(temp, `${JSON.stringify({ source, publications }, null, 2)}\n`);
    fs.renameSync(temp, destination);
  } finally {
    fs.rmSync(temp, { force: true });
  }
  console.info(`Synced ${publications.length} publications from Paperpile.`);
};

if (require.main === module) syncPublications();

module.exports = { parsePublications };
