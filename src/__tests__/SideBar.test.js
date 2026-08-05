/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SideBar from '../components/Template/SideBar';

describe('sidebar visitor map', () => {
  it('links the map to the stats page', () => {
    const { container } = render(
      <MemoryRouter>
        <SideBar />
      </MemoryRouter>,
    );
    const visitorMap = container.querySelector('.visitor-map-widget');
    const visitorMapLink = visitorMap.closest('a');

    expect(visitorMap).toBeInTheDocument();
    expect(visitorMapLink).toHaveAttribute('href', '/stats');
  });
});
