/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Stats from '../pages/Stats';

jest.mock('../layouts/Main', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));
jest.mock('../config/visitorApi', () => ({ __esModule: true, default: 'https://example.com/api' }));

describe('visitor statistics requests', () => {
  const originalFetch = global.fetch;
  afterEach(() => { global.fetch = originalFetch; });

  it('renders live summary and recent visits while filling in absent fields', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        summary: { today: 1234 },
        paths: [{ path: '/about', visits: 12 }],
        recentVisits: [{ city: 'Boston', country: 'US', visitedAt: new Date().toISOString() }],
      }),
    });
    const { container } = render(<Stats />);
    expect(await screen.findByText('1,234')).toBeInTheDocument();
    expect(screen.getByText('Boston, US')).toBeInTheDocument();
    expect(screen.getByText('/about')).toBeInTheDocument();
    expect(container.querySelectorAll('.stats-summary-value')[1]).toHaveTextContent('0');
    expect(container.querySelector('.stats-chart-line')).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith('https://example.com/api/stats', expect.objectContaining({ cache: 'no-store' }));
  });

  it('keeps the zeroed statistics when the endpoint fails', async () => {
    const json = jest.fn();
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 503, json });
    const { container } = render(<Stats />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    expect(json).not.toHaveBeenCalled();
    container.querySelectorAll('.stats-summary-value').forEach((value) => {
      expect(value).toHaveTextContent('0');
    });
  });

  it('aborts the statistics request when the page unmounts', () => {
    global.fetch = jest.fn(() => new Promise(() => {}));
    const { unmount } = render(<Stats />);
    const { signal } = global.fetch.mock.calls[0][1];
    expect(signal.aborted).toBe(false);
    unmount();
    expect(signal.aborted).toBe(true);
  });
});
