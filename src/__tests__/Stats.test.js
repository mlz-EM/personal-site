/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Stats from '../pages/Stats';

jest.mock('../layouts/Main', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));

describe('statistics page', () => {
  it('uses a fixed 90-day chart with an interactive crosshair', () => {
    const { container, getByText, queryByText } = render(<Stats />);
    const chart = container.querySelector('.stats-trend-chart');

    Object.defineProperty(chart, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({ left: 0, width: 760 }),
    });
    fireEvent.mouseMove(chart, { clientX: 380 });

    expect(getByText('Statistics')).toBeInTheDocument();
    expect(queryByText('30 days')).not.toBeInTheDocument();
    expect(queryByText('90 days')).not.toBeInTheDocument();
    expect(container.querySelectorAll('.stats-chart-crosshair')).toHaveLength(2);
    expect(container.querySelector('.stats-chart-tooltip-value')).toHaveTextContent('0 visits');
  });
});
