import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

interface LegacyManifest {
  redirects: Record<string, string>;
  pendingRedirects: Record<string, string>;
}

// Shared with scripts/check-legacy-urls.mts so the redirect table and the
// coverage gate can never disagree about what is being redirected.
const legacy = JSON.parse(
  readFileSync(join(process.cwd(), 'scripts', 'legacy-urls.json'), 'utf8'),
) as LegacyManifest;

const nextConfig: NextConfig = {
  // Deliberately NOT `output: 'standalone'`. The VPS runs this with `next start`
  // under PM2, and Next 16 warns that the two are incompatible — standalone
  // expects `node .next/standalone/server.js`, which additionally requires
  // .next/static and public/ to be copied into the standalone directory by hand.
  // Since node_modules is present on the box anyway, standalone buys nothing
  // here and only adds a step that is easy to get wrong.

  // .mdx is imported as a component, never routed directly. Keeping mdx out of
  // pageExtensions means a stray content file can never become a public URL.
  pageExtensions: ['ts', 'tsx'],

  reactStrictMode: true,
  poweredByHeader: false,

  // Trailing-slash-free canonical form. The legacy site used the same shape, so
  // every indexed URL keeps resolving without a redirect hop.
  trailingSlash: false,

  async redirects() {
    // Permanent: the old address is genuinely gone and the new one is its
    // replacement for good. `/tools/health/brm-calculator` was a typo in the old
    // sitemap; `/terms-and-conditions` was renamed; `/sitemap` and `/advertise`
    // are not being rebuilt.
    const permanent = Object.entries(legacy.redirects).map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));

    // Temporary: these URLs are indexed and their replacement tools have not been
    // built yet. A hard 404 gets them dropped from the index within weeks; a 301
    // would tell Google the address is permanently gone, which is the opposite of
    // the intent. A 307 holds the address open until the real page ships.
    const pending = Object.entries(legacy.pendingRedirects).map(([source, destination]) => ({
      source,
      destination,
      permanent: false,
    }));

    return [...permanent, ...pending];
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ];
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [['remark-gfm', {}]],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
