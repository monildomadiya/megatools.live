import { describe, expect, it, vi } from 'vitest';
vi.mock('server-only',()=>({}));
import { getSectionUrls, sitemapSections } from './routes';
describe('sitemap providers', () => {
  it('publishes all eight core pages and excludes coming-soon tools', async () => {
    expect((await getSectionUrls('core')).map((entry) => entry.path)).toEqual(['/', '/about', '/contact', '/disclaimer', '/privacy', '/sources', '/terms', '/updates']);
    for (const section of sitemapSections) { const entries=await getSectionUrls(section);expect(entries.length).toBeGreaterThan(0);expect(entries.every(entry=>!entry.path.includes('[')&&!entry.path.startsWith('/api'))).toBe(true); }
    expect((await getSectionUrls('tools')).filter(entry=>entry.path.startsWith('/military-time/'))).toHaveLength(24);
  });
});
