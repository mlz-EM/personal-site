/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
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

    expect(screen.getByText(/GS Stat\./)).toBeInTheDocument();
    expect(screen.getByText(/Papers: 74/)).toBeInTheDocument();
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

    expect(screen.getByText(/GS Stat\./)).toBeInTheDocument();
    expect(screen.getByText(/Papers: --/)).toBeInTheDocument();
    expect(screen.getByText(/Citations: --/)).toBeInTheDocument();
    expect(screen.getByText(/h-index: --/)).toBeInTheDocument();
    expect(screen.getByText(/updating daily/)).toBeInTheDocument();
  });
});
