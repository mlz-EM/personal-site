/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Publications from '../pages/Publications';
import scholarMetrics from '../data/scholarMetrics.json';

const mockScholarMetrics = {
  sourceUrl: 'https://scholar.google.com/citations?user=tkEx8OQAAAAJ&hl=en',
  updatedAt: null,
  papersAll: null,
  citationsAll: null,
  citationsSince2019: null,
  hIndexAll: null,
  hIndexSince2019: null,
  i10IndexAll: null,
  i10IndexSince2019: null,
  status: 'stale',
  lastAttemptAt: null,
  lastSuccessAt: null,
  lastError: null,
};

jest.mock('../layouts/Main', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));

jest.mock('../data/paperpile.json', () => {
  const { parsePublications } = jest.requireActual('../../scripts/sync-publications');
  return {
    source: 'https://example.org/papers.bib',
    publications: parsePublications(String.raw`
      @article{Lee2025,
        title = "{Oxides under bias}", author = "Lee\#, Darcy and Zhu, Menglin*\# and Ng, Alex",
        journal = "Science 2025 10:2", volume = 10, number = 2, pages = "12--15", year = 2025,
        doi = "10.1234/oxide", archivePrefix = "arXiv", eprint = "2501.12345"
      }
      @article{Ortiz2024,
        title = "{Imaging {LaFeO}$_{3}$ films}",
        author = "Calder\'{o}n Ortiz, Gabriel*\# and Johnson, Eva and Li, Ying and Morgan, Hazel and Zhu, Menglin and Costa, Luis and Lynn, Mei and Chen, Wei",
        journal = "Science", volume = 8, number = 3, pages = "32--40", year = 2024, doi = "10.1234/films"
      }
      @misc{LeePreprint,
        title = "{Thin films under bias}", author = "Zhu, M and Zhu, Tiancong",
        archivePrefix = "arXiv", eprint = "2401.12345", year = 2024
      }
    `),
  };
});

describe('Publications page metrics', () => {
  afterEach(() => {
    Object.assign(scholarMetrics, mockScholarMetrics);
  });

  it('renders GS stats when metrics are available', () => {
    Object.assign(scholarMetrics, {
      updatedAt: '2023-03-14T00:00:00Z',
      papersAll: 74,
      citationsAll: 1465,
      hIndexAll: 16,
      status: 'ok',
    });

    render(<Publications />);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Publications (Google Scholar)');
    const scholarLink = within(heading).getByRole('link', { name: 'Google Scholar' });
    expect(scholarLink).toHaveAttribute('href', 'https://scholar.google.com/citations?user=tkEx8OQAAAAJ');
    expect(screen.getByText('GS Stat.')).toBeInTheDocument();
    const info = screen.getByRole('heading', { name: 'Basic Info' }).nextElementSibling;
    expect(within(info).getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      '3 peer-reviewed publications I contributed to from 2024 to 2025',
      'Equal contribution denoted by *',
      'Corresponding authors denoted by #',
    ]);
    expect(screen.queryByRole('link', { name: /BibTeX|Paperpile/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Tools' })).not.toBeInTheDocument();
    const options = screen.getByRole('group', { name: 'Publication options' });
    expect(info.nextElementSibling).toBe(options);
    expect(options.nextElementSibling).toBe(screen.getByRole('separator'));
    expect([...options.querySelectorAll('input')].map((input) => input.type)).toEqual(['checkbox', 'search']);
    expect(screen.getByText(/Citations: 1,465/)).toBeInTheDocument();
    expect(screen.getByText(/h-index: 16/)).toBeInTheDocument();
    expect(screen.getByText(/updated 03\/2023/)).toBeInTheDocument();
  });

  it('renders fallback GS stats when metrics are unavailable', () => {
    Object.assign(scholarMetrics, {
      updatedAt: null,
      papersAll: null,
      citationsAll: null,
      hIndexAll: null,
      status: 'stale',
    });

    render(<Publications />);

    expect(screen.getByText('GS Stat.')).toBeInTheDocument();
    expect(screen.getByText(/Citations: --/)).toBeInTheDocument();
    expect(screen.getByText(/h-index: --/)).toBeInTheDocument();
    expect(screen.getByText(/updating daily/)).toBeInTheDocument();
  });
});

describe('Paperpile publication archive', () => {
  const yearSummary = (year) => screen.getByLabelText(new RegExp(`^${year},`), { selector: 'summary' });

  it('starts with all years collapsed and opens years independently or from the header', async () => {
    const user = userEvent.setup();
    render(<Publications />);
    const header = screen.getByRole('heading', { level: 2 }).closest('header');
    expect(within(header).getByRole('button', { name: 'Expand all' })).toHaveClass('page-title-action-btn');
    const latest = yearSummary('2025');
    const older = yearSummary('2024');
    expect(older).toHaveTextContent('2024 (2)');
    expect(latest.parentElement).not.toHaveAttribute('open');
    expect(older.parentElement).not.toHaveAttribute('open');
    await user.click(latest);
    expect(screen.getByRole('link', { name: '[Science] Oxides under bias' })).toBeVisible();
    await user.click(within(header).getByRole('button', { name: 'Collapse all' }));
    expect(latest.parentElement).not.toHaveAttribute('open');
    await user.click(older);
    expect(older.parentElement).toHaveAttribute('open');
    expect(latest.parentElement).not.toHaveAttribute('open');
    expect(screen.getByRole('link', { name: '[arXiv] Thin films under bias' })).toHaveAttribute('href', 'https://arxiv.org/abs/2401.12345');
    expect(screen.getByRole('link', { name: /Imaging LaFeO₃/ })).toHaveAttribute('href', 'https://doi.org/10.1234/films');
    await user.click(older);
    expect(older.parentElement).not.toHaveAttribute('open');
    await user.click(screen.getByRole('button', { name: 'Expand all' }));
    const titles = screen.getAllByRole('heading', { level: 4 });
    expect(titles).toHaveLength(3);
    titles.forEach((title) => expect(title).toBeVisible());
    await user.click(screen.getByRole('button', { name: 'Collapse all' }));
    titles.forEach((title) => expect(title).not.toBeVisible());
  });

  it('shows full bylines by default and only first and co-first authors when FULL is unchecked', async () => {
    const user = userEvent.setup();
    render(<Publications />);
    const full = screen.getByRole('checkbox', { name: 'FULL' });
    expect(full).toBeChecked();
    expect(screen.getAllByRole('checkbox')).toHaveLength(1);
    expect(yearSummary('2025')).toHaveAccessibleName('2025, 1 publication');
    expect(yearSummary('2024')).toHaveAccessibleName('2024, 2 publications');
    await user.click(yearSummary('2024'));
    const entry = screen.getByRole('link', { name: /Imaging LaFeO₃/ }).closest('li');
    const authors = entry.querySelector('.publication-authors');
    const fullList = 'Gabriel Calderón Ortiz*#, Eva Johnson, Ying Li, Hazel Morgan, Menglin Zhu, Luis Costa, Mei Lynn, Wei Chen';
    const primaryLink = entry.querySelector('h4 a').outerHTML;
    expect(authors).toHaveTextContent(fullList);
    await user.click(full);
    expect(authors).toHaveTextContent(/^Gabriel Calderón Ortiz\*#, et al\.$/);
    expect(within(authors).getByText('et al.', { selector: 'i' })).toBeVisible();
    expect(screen.getByText('Menglin Zhu', { selector: 'em.publication-owner' }).parentElement)
      .toHaveTextContent(/^Darcy Lee#, Menglin Zhu\*#, et al\.$/);
    expect(screen.getByText('M Zhu', { selector: 'em.publication-owner' }).parentElement)
      .toHaveTextContent(/^M Zhu, et al\.$/);
    await user.click(full);
    expect(authors).toHaveTextContent(fullList);
    expect(entry.querySelector('h4 a').outerHTML).toBe(primaryLink);
    expect(entry).not.toHaveTextContent(/32–40|2024/);
  });

  it('searches the full author lists, titles, journals and years in either display format', async () => {
    const user = userEvent.setup();
    render(<Publications />);
    await user.click(screen.getByRole('checkbox', { name: 'FULL' }));
    const search = screen.getByRole('searchbox', { name: 'Search' });
    await user.type(search, '2024 SCIENCE lafeo3 calderon Hazel');
    expect(yearSummary('2024')).toHaveAccessibleName('2024, 1 publication');
    expect(screen.queryByLabelText(/^2025,/)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Imaging LaFeO₃/ })).toBeVisible();
    expect(screen.queryByText(/Hazel Morgan/)).not.toBeInTheDocument();
    await user.click(screen.getByRole('checkbox', { name: 'FULL' }));
    expect(screen.getByText(/Hazel Morgan/)).toBeVisible();
    expect(screen.getByText('3 peer-reviewed publications I contributed to from 2024 to 2025')).toBeVisible();
    await user.type(search, ' missing');
    const status = screen.getByRole('status');
    expect(status).toHaveClass('listing-entry');
    expect(within(status).getByText('No publications match your search.')).toHaveClass('listing-title');
    expect(screen.getByRole('button', { name: 'Expand all' })).toBeDisabled();
    await user.clear(search);
    expect(yearSummary('2025').parentElement).not.toHaveAttribute('open');
    expect(yearSummary('2024').parentElement).not.toHaveAttribute('open');
  });

  it('prefixes the paper title with the journal name and emphasizes only the site author in the author list', async () => {
    const user = userEvent.setup();
    render(<Publications />);
    await user.click(screen.getByRole('button', { name: 'Expand all' }));
    const name = within(yearSummary('2025').parentElement).getByText('Menglin Zhu', { selector: 'em.publication-owner' });
    expect(name.parentElement).toHaveTextContent('Darcy Lee#, Menglin Zhu*#, Alex Ng');
    expect(name.nextElementSibling).toHaveAttribute('title', 'Equal contribution');
    expect(name.nextElementSibling).toHaveClass('publication-author-marker');
    expect(name.nextElementSibling.nextElementSibling).toHaveAttribute('title', 'Corresponding author');
    expect(within(name.parentElement).getAllByTitle('Corresponding author')).toHaveLength(2);
    expect(screen.getByText('M Zhu', { selector: 'em.publication-owner' }).parentElement).toHaveTextContent('M Zhu, Tiancong Zhu');
    expect(screen.queryByText('Tiancong Zhu', { selector: '.publication-owner' })).not.toBeInTheDocument();
    const entry = name.closest('li');
    const title = within(entry).getByRole('heading', { level: 4 });
    const paperLink = within(title).getByRole('link', { name: '[Science] Oxides under bias' });
    expect(paperLink).toHaveAttribute('href', 'https://doi.org/10.1234/oxide');
    expect(within(paperLink).getByText('[Science]', { selector: 'cite' })).toBeVisible();
    expect(entry).not.toHaveTextContent(/\b(?:10|12–15|2025)\b/);
    expect(within(entry).getByRole('link', { name: 'arXiv' })).toHaveAttribute('href', 'https://arxiv.org/abs/2501.12345');
  });
});
