/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Job from '../pages/Job';

jest.mock('../content/jobsFeed', () => () => ({
  header: { model: 'gemini-3.6-flash', generatedAt: '', notes: [] },
  source: 'Faculty Jobs',
  items: [
    {
      title: 'TTAP role',
      date: '2026-08-14',
      source: 'TTAP Daily Feed',
      url: 'https://example.com/job/4',
      metadata: {
        stars: 1, isNew: true, location: 'Cambridge', description: 'Four',
      },
    },
    {
      title: 'Interfolio role',
      date: '2026-08-14',
      source: 'Interfolio Faculty Jobs',
      url: 'https://apply.interfolio.com/1',
      metadata: {
        stars: 2, isNew: true, location: 'Boston', description: 'One',
      },
    },
    {
      title: 'Chronicle role',
      date: '2026-08-14',
      source: 'Chronicle Faculty Jobs',
      url: 'https://jobs.chronicle.com/job/2',
      metadata: {
        stars: 2, isNew: true, location: 'New York', description: 'Two',
      },
    },
    {
      title: 'Inside Higher Ed role',
      date: '2026-08-14',
      source: 'Inside Higher Ed Faculty Jobs',
      url: 'https://careers.insidehighered.com/job/3',
      metadata: {
        stars: 2, isNew: true, location: 'Chicago', description: 'Three',
      },
    },
  ],
}));

describe('combined faculty jobs page', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-08-15T12:00:00Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('shows jobs from every feed without a source filter', () => {
    window.scrollTo = jest.fn();
    render(
      <MemoryRouter>
        <Job />
      </MemoryRouter>,
    );

    expect(screen.queryByLabelText('Source')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /TTAP role/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Interfolio role/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Chronicle role/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Inside Higher Ed role/ })).toBeInTheDocument();

    expect(screen.getByText('TTAP Daily Feed')).toBeInTheDocument();
    expect(screen.getByText('Interfolio Faculty Jobs')).toBeInTheDocument();
    expect(screen.getByText('Chronicle Faculty Jobs')).toBeInTheDocument();
    expect(screen.getByText('Inside Higher Ed Faculty Jobs')).toBeInTheDocument();
  });

  it('clears date and fit filters across all feeds', () => {
    window.scrollTo = jest.fn();
    render(<MemoryRouter><Job /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText('Fit'), { target: { value: '3' } });
    fireEvent.change(screen.getByLabelText('After'), { target: { value: '2026-08-15' } });
    expect(screen.getByText(/No Faculty jobs match/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.getByLabelText('Fit')).toHaveValue('1');
    expect(screen.getByLabelText('After')).toHaveValue('2026-07-16');
    expect(screen.getByLabelText('NEW')).not.toBeChecked();
    expect(screen.getByRole('link', { name: /TTAP role/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Interfolio role/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Chronicle role/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Inside Higher Ed role/ })).toBeInTheDocument();
  });
});
