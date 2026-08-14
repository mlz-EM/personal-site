/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FacultyJobs from '../pages/FacultyJobs';

jest.mock('../content/facultyJobsFeed', () => () => ({
  header: { model: 'gemini-3.6-flash', generatedAt: '', notes: [] },
  source: 'Faculty Jobs',
  sources: [
    'Interfolio Faculty Jobs',
    'Chronicle Faculty Jobs',
    'Inside Higher Ed Faculty Jobs',
  ],
  items: [
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
  it('defaults to all sources and filters to a selected source', () => {
    window.scrollTo = jest.fn();
    render(
      <MemoryRouter>
        <FacultyJobs />
      </MemoryRouter>,
    );

    const source = screen.getByLabelText('Source');
    expect(source).toHaveValue('all');
    expect(screen.getByRole('link', { name: /Interfolio role/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Chronicle role/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Inside Higher Ed role/ })).toBeInTheDocument();

    fireEvent.change(source, { target: { value: 'Chronicle Faculty Jobs' } });
    expect(screen.queryByRole('link', { name: /Interfolio role/ })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Chronicle role/ })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Inside Higher Ed role/ })).not.toBeInTheDocument();
  });
});
