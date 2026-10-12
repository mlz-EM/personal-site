/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import People from '../pages/People';

jest.mock('../layouts/Main', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));
jest.mock('../components/Template/PageTools', () => () => null);
jest.mock('../data/people.json', () => ({
  page: { title: 'People' },
  people: [
    {
      id: 'student',
      name: 'Incoming student',
      role: 'PhD student',
      status: 'incoming',
      startDate: '2027-01',
      showOnPage: true,
      bio: 'Student biography',
      researchInterests: ['Microscopy'],
      thesis: { url: 'https://example.com/thesis', label: 'My thesis' },
    },
    {
      id: 'alumnus',
      name: 'Alumni member',
      role: 'Postdoc',
      status: 'alumni',
      showOnPage: true,
      bio: 'Hidden alumni biography',
      researchInterests: ['Hidden topic'],
    },
    {
      id: 'hidden', name: 'Hidden member', role: 'PI', showOnPage: false,
    },
  ],
}));

describe('people page', () => {
  it('preserves section grouping, member details, and all/individual expansion', () => {
    render(<People />);
    expect(screen.queryByText('Hidden member')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'PhD Students' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Alumni' })).toBeInTheDocument();
    expect(screen.getByText('Starting Jan 2027')).toBeInTheDocument();
    expect(screen.getByText('Student biography')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'My thesis' })).toHaveAttribute('href', 'https://example.com/thesis');
    expect(screen.queryByText('Hidden alumni biography')).not.toBeInTheDocument();
    expect(screen.queryByText('Hidden topic')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Collapse all' }));
    expect(screen.queryByText('Student biography')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Expand Incoming student' })).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(screen.getByRole('button', { name: 'Expand Incoming student' }));
    expect(screen.getByText('Student biography')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Expand Alumni member' })).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(screen.getByRole('button', { name: 'Collapse all' }));
    fireEvent.click(screen.getByRole('button', { name: 'Expand all' }));
    expect(screen.getByRole('button', { name: 'Collapse Alumni member' })).toHaveAttribute('aria-expanded', 'true');
  });
});
