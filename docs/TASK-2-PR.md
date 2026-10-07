# Task 2 review

Title: feat: SEO foundation (metadata, JSON-LD, sitemaps, robots)

Adds shared canonical, Open Graph, Twitter, robots and verification metadata for all published pages. Adds safely escaped BreadcrumbList markup and home-page WebSite/Organization markup, plus a free WebApplication helper for future calculators. A 1200×630 ImageResponse supplies the default share image.

Sitemaps read section URL providers in src/lib/routes.ts. Only the eight published core URLs are included now; later data tasks add generated paths and dataset meta.retrievedAt. Static pages omit lastModified rather than inventing a dataset retrieval date.

Next.js 16.3.8 rejected a separate /sitemap.xml index route as conflicting with its generated metadata route. The task's fallback is used: robots.txt advertises /sitemap/core.xml, /sitemap/per-diem.xml, /sitemap/bah.xml, /sitemap/military-pay.xml, /sitemap/va.xml, and /sitemap/tools.xml.

Data sources touched: none. Framework references: https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps and https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap.

Manual actions: set NEXT_PUBLIC_GSC_VERIFICATION to verify ownership; submit the section sitemap URLs to Search Console after deployment. Configure a Git remote to create the PR.

Validation: lint, typecheck, 13 unit tests, and production build passed on local Node 24 (CI targets Node 22). HTTP source checks verified metadata and parsed JSON-LD on all eight pages. Robots lists six working XML sitemaps; core includes eight URLs. The 1200×630 PNG returned successfully and was visually inspected.

