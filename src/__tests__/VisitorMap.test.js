/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import React from 'react';
import { render } from '@testing-library/react';
import VisitorMap, { getVisitSessionKey } from '../components/VisitorMap';

describe('anonymous visit session', () => {
  const storageKey = 'mlz-em-visit-session';
  const startedAt = Date.parse('2026-08-03T12:00:00Z');
  let originalLocks;

  beforeEach(() => {
    originalLocks = navigator.locks;
    Object.defineProperty(navigator, 'locks', {
      configurable: true,
      value: {
        request: jest.fn((name, callback) => callback()),
      },
    });
    window.localStorage.clear();
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'locks', {
      configurable: true,
      value: originalLocks,
    });
  });

  it('reuses one session across page views and tabs sharing local storage', async () => {
    const firstKey = await getVisitSessionKey(startedAt);
    const secondKey = await getVisitSessionKey(startedAt + 10 * 60 * 1000);
    const storedSession = JSON.parse(window.localStorage.getItem(storageKey));

    expect(firstKey).toMatch(/^[a-zA-Z0-9_-]{16,64}$/);
    expect(secondKey).toBe(firstKey);
    expect(storedSession).toEqual({
      key: firstKey,
      lastActivityAt: startedAt + 10 * 60 * 1000,
    });
    expect(navigator.locks.request).toHaveBeenCalledTimes(2);
  });

  it('starts a new visit after 30 minutes of inactivity', async () => {
    const firstKey = await getVisitSessionKey(startedAt);
    const secondKey = await getVisitSessionKey(startedAt + 30 * 60 * 1000);

    expect(secondKey).not.toBe(firstKey);
  });

  it('replaces invalid session data', async () => {
    window.localStorage.setItem(storageKey, '{"key":"invalid"}');

    const sessionKey = await getVisitSessionKey(startedAt);
    const storedSession = JSON.parse(window.localStorage.getItem(storageKey));

    expect(sessionKey).not.toBe('invalid');
    expect(storedSession.key).toBe(sessionKey);
  });
});

describe('visitor map prerendering', () => {
  const originalUserAgent = navigator.userAgent;

  afterEach(() => {
    Object.defineProperty(navigator, 'userAgent', {
      configurable: true,
      value: originalUserAgent,
    });
  });

  it('keeps ReactSnap output lightweight', () => {
    Object.defineProperty(navigator, 'userAgent', {
      configurable: true,
      value: 'ReactSnap',
    });

    const { container } = render(<VisitorMap />);

    expect(container.querySelector('.visitor-map-widget')).toBeInTheDocument();
    expect(container.querySelectorAll('.rsm-geography')).toHaveLength(0);
  });
});
