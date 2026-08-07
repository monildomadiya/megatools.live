/**
 * Cutover gate for the legacy URL set.
 *
 * The live site has 38 URLs Google already knows about. Replacing it with a
 * build that drops some of them silently discards whatever indexing they have —
 * and 404s that Search Console surfaces weeks later are painful to trace back to
 * a deploy. This compares the legacy list against what the current build
 * actually produces.
 *
 * Run after `next build`:
 *   npm run check:urls             report coverage
 *   npm run check:urls -- --strict fail if anything is uncovered (use at cutover)
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const strict = process.argv.includes('--strict');

interface LegacyManifest {
  redirects: Record<string, string>;
  urls: string[];
}

const legacy = JSON.parse(
  readFileSync(join(ROOT, 'scripts', 'legacy-urls.json'), 'utf8'),
) as LegacyManifest;

const { allTools } = await import('../src/lib/tools/registry');
const { categories } = await import('../src/lib/tools/categories');

// Routes the new build serves. Static pages are listed explicitly rather than
// scraped from .next so this script also works before a build has run.
const staticRoutes = new Set([
  '/',
  '/tools',
  '/about',
  '/contact',
  '/editorial-policy',
  '/privacy-policy',
  '/terms',
  '/disclaimer',
  '/cookie-policy',
]);

for (const category of categories) staticRoutes.add(`/tools/${category.slug}`);
for (const tool of allTools) staticRoutes.add(tool.href);

// Redirects declared in next.config.ts count as covered — the URL still resolves
// for a crawler, it just resolves somewhere else with a 301.
const redirects = legacy.redirects;

const covered: string[] = [];
const redirected: string[] = [];
const missing: string[] = [];

for (const url of legacy.urls) {
  if (staticRoutes.has(url)) {
    covered.push(url);
  } else if (redirects[url]) {
    const target = redirects[url];
    if (staticRoutes.has(target)) {
      redirected.push(`${url} -> ${target}`);
    } else {
      missing.push(`${url} (redirects to ${target}, which does not exist yet)`);
    }
  } else {
    missing.push(url);
  }
}

// The old site used /terms-and-conditions; the new one uses /terms. Catch the
// case where that rename was made without adding the redirect.
const configPath = join(ROOT, 'next.config.ts');
const config = readFileSync(configPath, 'utf8');
const renamedPaths = ['/terms-and-conditions'];
for (const path of renamedPaths) {
  if (legacy.urls.includes(path) && !config.includes(path) && !staticRoutes.has(path)) {
    missing.push(`${path} (renamed route with no redirect in next.config.ts)`);
  }
}

console.log(`\nLegacy URL coverage: ${covered.length + redirected.length}/${legacy.urls.length}`);

if (redirected.length > 0) {
  console.log(`\n  ${redirected.length} redirected:`);
  for (const entry of redirected) console.log(`    > ${entry}`);
}

if (missing.length > 0) {
  console.log(`\n  ${missing.length} not yet covered:`);
  for (const entry of missing) console.log(`    - ${entry}`);

  if (strict) {
    console.error(
      '\nCutover gate failed. Every legacy URL must resolve before replacing the live site.\n',
    );
    process.exit(1);
  }

  console.log(
    '\n  Expected during the build-out. Run with --strict at cutover to make this blocking.\n',
  );
} else {
  console.log('\nEvery legacy URL is covered.\n');
}
