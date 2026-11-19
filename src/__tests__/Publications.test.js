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
        title = "{Oxides under bias}", author = "Lee, Darcy and Zhu, Menglin",
        journal = "Science", volume = 10, pages = "12--15", year = 2025,
        doi = "10.1234/oxide"
      }
      @article{Ortiz2024,
        title = "{Imaging {LaFeO}$_{3}$ films}", author = "Calder\'{o}n Ortiz, Gabriel",
        journal = "Science", year = 2024, doi = "10.1234/films"
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
    expect(screen.queryByRole('link', { name: 'Download BibTeX' })).not.toBeInTheDocument();
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

  it('opens years independently and expands or collapses the whole archive from the header', async () => {
    const user = userEvent.setup();
    render(<Publications />);
    const header = screen.getByRole('heading', { level: 2 }).closest('header');
    expect(within(header).getByRole('button', { name: 'Expand all' })).toHaveClass('page-title-action-btn');
    const older = yearSummary('2024');
    expect(older).toHaveTextContent('2024 (2)');
    expect(older.parentElement).not.toHaveAttribute('open');
    await user.click(yearSummary('2025'));
    expect(screen.getByRole('link', { name: 'Oxides under bias' })).toBeVisible();
    expect(older.parentElement).not.toHaveAttribute('open');
    await user.click(within(header).getByRole('button', { name: 'Collapse all' }));
    expect(yearSummary('2025').parentElement).not.toHaveAttribute('open');
    await user.click(older);
    expect(older.parentElement).toHaveAttribute('open');
    expect(screen.getByRole('link', { name: 'Thin films under bias' })).toHaveAttribute('href', 'https://arxiv.org/abs/2401.12345');
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

  it('shows counts on the year headings without a search, format selector, or overall count', () => {
    render(<Publications />);
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    expect(screen.queryByText('3 publications')).not.toBeInTheDocument();
    expect(yearSummary('2025')).toHaveAccessibleName('2025, 1 publication');
    expect(yearSummary('2024')).toHaveAccessibleName('2024, 2 publications');
  });

  it('displays full citations and highlights the site author', async () => {
    const user = userEvent.setup();
    render(<Publications />);
    await user.click(screen.getByRole('button', { name: 'Expand all' }));
    const name = screen.getByText('Menglin Zhu', { selector: 'strong' });
    expect(name.parentElement).toHaveTextContent('Darcy Lee, Menglin Zhu');
    expect(screen.getByText('M Zhu', { selector: 'strong' }).parentElement).toHaveTextContent('M Zhu, Tiancong Zhu');
    expect(screen.queryByText('Tiancong Zhu', { selector: 'strong' })).not.toBeInTheDocument();
    expect(within(name.closest('li')).getByText('Science')).toBeVisible();
  });
});
