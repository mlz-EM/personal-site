/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import '@testing-library/react';
import React, { act } from 'react';
import ReactDOM from 'react-dom/client';
import App from '../App';

describe('renders the app', () => {
  const fetchMock = jest.fn(() => Promise.resolve({
    ok: true,
    text: () => Promise.resolve('# Mock markdown'),
  }));

  window.scrollTo = jest.fn();

  let originalFetch;
  let container;

  beforeAll(() => {
    originalFetch = global.fetch;
    global.fetch = fetchMock;
  });

  beforeEach(async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    fetchMock.mockClear();
    await act(async () => {
      await ReactDOM.createRoot(container).render(<App />);
    });
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
    jest.clearAllMocks();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it('should render the app', async () => {
    expect(document.body).toBeInTheDocument();
  });

  it('should render the title', async () => {
    expect(document.title).toBe('Menglin Zhu');
  });

  it('can navigate to /about', async () => {
    const aboutLink = document.querySelector(
      '#header > nav > ul > li:nth-child(1) > a',
    );
    expect(aboutLink).toBeInTheDocument();
    await act(async () => {
      await aboutLink.click();
    });
    expect(document.title).toContain('About |');
    expect(window.location.pathname).toBe('/about');
    expect(window.scrollTo).toHaveBeenNthCalledWith(1, 0, 0);
    expect(fetchMock).toHaveBeenCalled();
  });

  it('can navigate to /projects', async () => {
    const contactLink = document.querySelector(
      '#header > nav > ul > li:nth-child(2) > a',
    );
    expect(contactLink).toBeInTheDocument();
    await act(async () => {
      await contactLink.click();
    });
    expect(document.title).toContain('Projects |');
    expect(window.location.pathname).toBe('/projects');
  });
});
