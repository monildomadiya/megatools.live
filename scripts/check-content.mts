/**
 * Pre-deploy content gate.
 *
 * The failure mode this exists to prevent is the one that sank the previous
 * version of this site: pages that look finished, pass a build, and are then
 * rejected as thin or unfinished. Word counts, citation counts, and unresolved
 * placeholders are all things a machine can check, so a machine checks them
 * every time rather than a person remembering to.
 *
 * Run with: npm run check:content
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const SRC = join(ROOT, 'src');

const MIN_TOOL_WORDS = 1000;
const MIN_BLOG_WORDS = 800;
const MIN_FAQS = 5;
const MIN_SOURCES = 2;
const MAX_META_TITLE = 60;
const MIN_META_DESCRIPTION = 110;
const MAX_META_DESCRIPTION = 165;

const errors: string[] = [];
const warnings: string[] = [];

function fail(message: string) {
  errors.push(message);
}

function warn(message: string) {
  warnings.push(message);
}

function walk(dir: string, predicate: (path: string) => boolean): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...walk(full, predicate));
    } else if (predicate(full)) {
      out.push(full);
    }
  }
  return out;
}

/**
 * Approximate prose word count: strips fenced code, JSX/HTML tags, markdown
 * table pipes, and heading/emphasis markers so the number reflects what a reader
 * actually reads rather than what the file contains.
 */
function countWords(mdx: string): number {
  const prose = mdx
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^import .*$/gm, ' ')
    .replace(/^export .*$/gm, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\|/g, ' ')
    .replace(/[#*_>`[\]()-]/g, ' ');

  return prose.split(/\s+/).filter((word) => /[a-zA-Z]/.test(word)).length;
}

// --- 1. Unresolved placeholders -------------------------------------------
// These mark facts only the site owner can supply (legal entity, jurisdiction,
// contact address, founder bio). Shipping one to production would put literal
// square brackets on a policy page.

const sourceFiles = walk(SRC, (p) => /\.(ts|tsx|mdx)$/.test(p));

for (const file of sourceFiles) {
  const content = readFileSync(file, 'utf8');
  for (const match of content.matchAll(/\[\[NEEDS INPUT:([^\]]*)\]\]/g)) {
    const label = match[1]!.replace(/\s+/g, ' ').trim();
    const short = label.length > 60 ? `${label.slice(0, 60)}…` : label;
    fail(`${relative(ROOT, file)} — unresolved placeholder: ${short}`);
  }
}

// --- 2. Tool content depth and metadata quality ----------------------------

const toolsDir = join(SRC, 'content', 'tools');
const contentFiles = walk(toolsDir, (p) => p.endsWith('content.mdx'));

if (contentFiles.length === 0) {
  warn('No tool content files found — nothing to check.');
}

for (const file of contentFiles) {
  const rel = relative(ROOT, file);
  const words = countWords(readFileSync(file, 'utf8'));
  if (words < MIN_TOOL_WORDS) {
    fail(`${rel} — ${words} words, needs at least ${MIN_TOOL_WORDS}`);
  }
}

// Metadata is validated by reading the compiled registry through tsx, which
// means the same objects the site renders are the ones being checked.
const { allTools } = await import('../src/lib/tools/registry');

// modules.ts is read as text rather than imported: importing it would pull in
// every .mdx body, which this runtime cannot parse. The keys are all we need.
const modulesSource = readFileSync(join(SRC, 'content', 'tools', 'modules.ts'), 'utf8');
const registeredModules = new Set(
  [...modulesSource.matchAll(/^\s*'([a-z0-9-]+\/[a-z0-9-]+)':/gm)].map((m) => m[1]!),
);

for (const tool of allTools) {
  const id = `${tool.category}/${tool.slug}`;

  if (tool.metaTitle.length > MAX_META_TITLE) {
    warn(`${id} — metaTitle is ${tool.metaTitle.length} chars, may truncate in SERPs`);
  }
  if (tool.metaDescription.length < MIN_META_DESCRIPTION) {
    warn(`${id} — metaDescription is only ${tool.metaDescription.length} chars`);
  }
  if (tool.metaDescription.length > MAX_META_DESCRIPTION) {
    warn(`${id} — metaDescription is ${tool.metaDescription.length} chars, will be cut`);
  }
  if (tool.faqs.length < MIN_FAQS) {
    fail(`${id} — ${tool.faqs.length} FAQs, needs at least ${MIN_FAQS}`);
  }
  if (tool.sources.length < MIN_SOURCES) {
    fail(`${id} — ${tool.sources.length} sources, needs at least ${MIN_SOURCES}`);
  }
  if (tool.updatedAt < tool.publishedAt) {
    fail(`${id} — updatedAt (${tool.updatedAt}) is before publishedAt (${tool.publishedAt})`);
  }
  if (!registeredModules.has(id)) {
    fail(`${id} — in the registry but missing from src/content/tools/modules.ts`);
  }

  for (const related of tool.relatedSlugs) {
    if (!allTools.some((t) => `${t.category}/${t.slug}` === related)) {
      fail(`${id} — relatedSlugs points at "${related}", which is not a published tool`);
    }
  }
}

// A tool wired up in modules.ts but absent from the registry has no route and no
// sitemap entry — it is dead code that looks alive.
for (const id of registeredModules) {
  if (!allTools.some((t) => `${t.category}/${t.slug}` === id)) {
    fail(`${id} — in modules.ts but missing from the registry`);
  }
}

// --- 3. Blog depth ---------------------------------------------------------

const blogDir = join(SRC, 'content', 'blog');
let blogFiles: string[] = [];
try {
  blogFiles = walk(blogDir, (p) => p.endsWith('.mdx'));
} catch {
  // No blog yet.
}

for (const file of blogFiles) {
  const words = countWords(readFileSync(file, 'utf8'));
  if (words < MIN_BLOG_WORDS) {
    fail(`${relative(ROOT, file)} — ${words} words, needs at least ${MIN_BLOG_WORDS}`);
  }
}

// --- Report ----------------------------------------------------------------

if (warnings.length > 0) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const warning of warnings) console.log(`  ! ${warning}`);
}

if (errors.length > 0) {
  console.error(`\n${errors.length} blocking issue(s):`);
  for (const error of errors) console.error(`  x ${error}`);
  console.error('\nContent gate failed. These must be resolved before deploying.\n');
  process.exit(1);
}

console.log(
  `\nContent gate passed — ${allTools.length} tool(s), ${blogFiles.length} article(s).\n`,
);
