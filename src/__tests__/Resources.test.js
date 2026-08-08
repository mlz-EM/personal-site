import { getResourceAssetUrl } from '../pages/Resources';

describe('resource asset URLs', () => {
  it('keeps local media inside the deployed GitHub Pages base path', () => {
    expect(getResourceAssetUrl(
      'images/about/4D-STEM.gif',
      '/personal-site',
    )).toBe('/personal-site/images/about/4D-STEM.gif');
  });

  it('leaves absolute media URLs unchanged', () => {
    expect(getResourceAssetUrl(
      'https://example.com/media.mp4',
      '/personal-site',
    )).toBe('https://example.com/media.mp4');
  });
});
