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
  pendingRedirects: Record<string, string>;
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
const pendingRedirects = legacy.pendingRedirects;

const covered: string[] = [];
const redirected: string[] = [];
const pending: string[] = [];
const missing: string[] = [];
const errors: string[] = [];

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
  } else if (pendingRedirects[url]) {
    pending.push(`${url} -> ${pendingRedirects[url]} (307, holding the address)`);
  } else {
    missing.push(url);
  }
}

// A redirect is matched before a page is served, so a pendingRedirects entry
// left in place after its tool ships makes the new page permanently
// unreachable — and it would look fine in the build output, because the page
// is still generated. This is the single most damaging way to get this wrong,
// so it fails the check unconditionally rather than only under --strict.
for (const [url, target] of Object.entries(pendingRedirects)) {
  if (staticRoutes.has(url)) {
    errors.push(
      `${url} is now a real page but is still listed in pendingRedirects (-> ${target}). ` +
        `Remove it from scripts/legacy-urls.json or the page will never be served.`,
    );
  }
}

// next.config.ts builds its redirect table from this same manifest, so the two
// cannot drift. Confirm the wiring is actually in place rather than assuming it.
const config = readFileSync(join(ROOT, 'next.config.ts'), 'utf8');
if (!config.includes('legacy.redirects') || !config.includes('legacy.pendingRedirects')) {
  errors.push(
    'next.config.ts no longer reads both redirect tables from scripts/legacy-urls.json. ' +
      'Nothing in this manifest is being served.',
  );
}

const resolved = covered.length + redirected.length;

console.log(`\nLegacy URL coverage: ${resolved} live, ${pending.length} held, of ${legacy.urls.length}`);

if (redirected.length > 0) {
  console.log(`\n  ${redirected.length} permanently redirected:`);
  for (const entry of redirected) console.log(`    > ${entry}`);
}

if (pending.length > 0) {
  console.log(`\n  ${pending.length} held by a temporary redirect — tool not built yet:`);
  for (const entry of pending) console.log(`    ~ ${entry}`);
}

if (missing.length > 0) {
  console.log(`\n  ${missing.length} returning 404 with nothing holding them:`);
  for (const entry of missing) console.log(`    - ${entry}`);
}

if (errors.length > 0) {
  console.error(`\n${errors.length} blocking problem(s):`);
  for (const entry of errors) console.error(`  x ${entry}`);
  console.error('');
  process.exit(1);
}

// A bare 404 on an indexed URL is never acceptable now that the new site is
// live — it costs indexing immediately, whereas a held address costs nothing.
if (missing.length > 0) {
  console.error(
    'Every legacy URL must either exist or be held by a redirect. Add the missing ones to\n' +
      'pendingRedirects in scripts/legacy-urls.json.\n',
  );
  process.exit(1);
}

if (pending.length > 0) {
  if (strict) {
    console.error(
      '\nCutover gate failed. Held addresses are a stopgap: every legacy URL needs its own\n' +
        'page before this passes with --strict.\n',
    );
    process.exit(1);
  }
  console.log('\n  Held addresses are a stopgap. Each one needs its real page building.\n');
} else {
  console.log('\nEvery legacy URL resolves to its own page.\n');
}
