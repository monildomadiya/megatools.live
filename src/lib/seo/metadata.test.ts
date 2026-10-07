import { describe, expect, it } from 'vitest';
import { buildMetadata, canonicalUrl, siteOrigin } from './metadata';
describe('canonical URLs', () => {
  it('removes www, trailing slashes, query and fragment', () => {
    expect(canonicalUrl('/per-diem/colorado/?fy=FY2027#rates', 'https://www.megatools.live/')).toBe('https://megatools.live/per-diem/colorado');
    expect(canonicalUrl('/?query=1', 'https://www.megatools.live')).toBe('https://megatools.live');
  });
  it('keeps the configured origin for absolute paths', () => {
    expect(canonicalUrl('https://other.example/about/?ref=1', 'https://megatools.live')).toBe('https://megatools.live/about');
    expect(siteOrigin('https://www.megatools.live/prefix?x=1')).toBe('https://megatools.live');
    expect(() => siteOrigin('file:///tmp')).toThrow('HTTP or HTTPS');
  });
  it('aligns canonical, Open Graph and Twitter metadata', () => {
    const metadata = buildMetadata({ title: 'About', description: 'About MegaTools.', path: '/about/?ref=1' });
    expect(metadata.alternates?.canonical).toBe('https://megatools.live/about');
    expect(metadata.openGraph).toMatchObject({ url: 'https://megatools.live/about', title: 'About | MegaTools' });
    expect(metadata.twitter).toMatchObject({ card: 'summary_large_image', title: 'About | MegaTools' });
    expect(metadata.robots).toEqual({ index: true, follow: true });
  });
  it('rejects copy over the editorial length limits', () => {
    expect(() => buildMetadata({ title: 'a'.repeat(61), description: 'A.', path: '/' })).toThrow('title exceeds');
    expect(() => buildMetadata({ title: 'About', description: 'a'.repeat(156), path: '/' })).toThrow('description exceeds');
  });
});
