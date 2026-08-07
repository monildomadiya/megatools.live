import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Self-hosted on the VPS behind nginx — standalone bundles the server so the
  // deploy artifact does not need node_modules on the box.
  output: 'standalone',

  // .mdx is imported as a component, never routed directly. Keeping mdx out of
  // pageExtensions means a stray content file can never become a public URL.
  pageExtensions: ['ts', 'tsx'],

  reactStrictMode: true,
  poweredByHeader: false,

  // Trailing-slash-free canonical form. The legacy site used the same shape, so
  // every indexed URL keeps resolving without a redirect hop.
  trailingSlash: false,

  async redirects() {
    return [
      {
        // Legacy typo URL that shipped in the old sitemap.
        source: '/tools/health/brm-calculator',
        destination: '/tools/health/bmr-calculator',
        permanent: true,
      },
      {
        // The old site used the longer form; /terms is shorter and is what the
        // footer now links to. Both were indexed, so the old one has to keep
        // resolving.
        source: '/terms-and-conditions',
        destination: '/terms',
        permanent: true,
      },
      {
        // Old HTML sitemap page. The XML sitemap is the canonical one.
        source: '/sitemap',
        destination: '/tools',
        permanent: true,
      },
      {
        // We do not sell direct placements, so this page is not being rebuilt.
        source: '/advertise',
        destination: '/contact',
        permanent: true,
      },
    ];
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
