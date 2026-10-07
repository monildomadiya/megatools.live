# Task 0 review

Title: chore: bootstrap Next.js 16 project

Bootstraps MegaTools with Next.js 16, React 19, strict TypeScript, Tailwind v4, pnpm, and Node 22 CI. Adds the folder skeleton, coming-soon page, formatting and state slug helpers with unit tests, data import/validation entry points, and generated ads.txt.

Data sources touched: none. No official rates are included in Task 0.

Manual actions: configure a GitHub remote to open the PR; replace CONTACT_EMAIL before publishing. Ads remain disabled in the environment template.

Validation: frozen-lockfile install, lint, typecheck, all 5 unit tests, both data scripts, and production build passed on Node 24. Node 22 is configured in .nvmrc and CI. The home page was statically generated and prebuild produced public/ads.txt.

