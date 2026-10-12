/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ArXiv from '../pages/ArXiv';
import Job from '../pages/Job';

jest.mock('../layouts/Main', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));
jest.mock('../components/Template/PageTools', () => () => null);
jest.mock('../content/arxivFeed', () => () => ({
  header: null,
  items: [
    {
      title: 'New paper',
      date: '2026-10-11',
      source: 'arXiv',
      url: 'https://arxiv.org/1',
      metadata: { isNew: true, summary: 'New finding' },
    },
    {
      title: 'Seen paper',
      date: '2026-10-10',
      source: 'arXiv',
      url: 'https://arxiv.org/2',
      metadata: { isNew: false, summary: 'Seen finding' },
    },
    {
      title: 'Old paper',
      date: '2026-01-01',
      source: 'arXiv',
      url: 'https://arxiv.org/3',
      metadata: { isNew: true, summary: 'Old finding' },
    },
  ],
}));
jest.mock('../content/jobsFeed', () => () => ({
  header: null,
  source: 'TTAP Daily Feed',
  items: [
    {
      title: 'New role',
      date: '2026-10-11',
      source: 'TTAP',
      url: 'https://example.com/1',
      metadata: {
        isNew: true, stars: 2, location: 'Boston', description: 'New role description',
      },
    },
    {
      title: 'Seen role',
      date: '2026-10-10',
      source: 'TTAP',
      url: 'https://example.com/2',
      metadata: {
        isNew: false, stars: 1, location: 'Chicago', description: '',
      },
    },
    {
      title: 'Old role',
      date: '2026-01-01',
      source: 'TTAP',
      url: 'https://example.com/3',
      metadata: {
        isNew: true, stars: 3, location: 'New York', description: 'Old role',
      },
    },
  ],
}));

describe('daily feed pages', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-10-12T12:00:00Z'));
  });
  afterAll(() => jest.useRealTimers());

  it.each([
    [ArXiv, 'paper', 'arxiv-filter-date', 'arxiv-only-new'],
    [Job, 'role', 'filter-date', 'only-new'],
  ])('preserves the date window and Clear behavior for %p', (Page, noun, dateId, newId) => {
    render(<Page />);
    const date = screen.getByLabelText('After');
    const onlyNew = screen.getByLabelText('NEW');
    expect(date).toHaveAttribute('id', dateId);
    expect(onlyNew).toHaveAttribute('id', newId);
    expect(date).toHaveValue('2026-09-12');
    expect(onlyNew).toBeChecked();
    expect(screen.getByRole('link', { name: `[NEW] New ${noun}` })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: `Seen ${noun}` })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: `[NEW] Old ${noun}` })).not.toBeInTheDocument();

    fireEvent.change(date, { target: { value: '' } });
    expect(screen.getByRole('link', { name: `[NEW] Old ${noun}` })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(date).toHaveValue('2026-09-12');
    expect(onlyNew).not.toBeChecked();
    expect(screen.getByRole('link', { name: `Seen ${noun}` })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: `[NEW] Old ${noun}` })).not.toBeInTheDocument();
  });

  it('applies the job fit threshold and resets it to one', () => {
    render(<Job />);
    fireEvent.change(screen.getByLabelText('Fit'), { target: { value: '3' } });
    expect(screen.queryByRole('link', { name: '[NEW] New role' })).not.toBeInTheDocument();
    expect(screen.getByText('No Faculty jobs match the selected filters.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.queryByText('No Faculty jobs match the selected filters.')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Fit')).toHaveValue('1');
    expect(screen.getByRole('link', { name: 'Seen role' })).toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument();
    expect(screen.queryByText('Source:')).not.toBeInTheDocument();
  });
});
