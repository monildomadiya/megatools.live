import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { markdownHeadingText, slugify } from './headings';
import type { TocEntry } from './types';

/**
 * The section list for a tool's article body, read from the MDX source.
 *
 * Reading the file rather than parsing the compiled component is the cheap way
 * to get this: every tool page is prerendered with `dynamicParams: false`, so
 * this runs at build time only and never on a request. The alternative —
 * a rehype plugin that hangs the headings off an export — buys nothing here and
 * costs a dependency plus a build-config change.
 *
 * `node:fs` is why this is a separate module from `headings.ts`. Fifty-odd
 * client calculators reach into `@/components/tool/ToolShell`, so anything they
 * can transitively import has to stay bundleable; only the page imports this.
 */
export function tocForTool(category: string, slug: string): TocEntry[] {
  const file = join(process.cwd(), 'src', 'content', 'tools', category, slug, 'content.mdx');

  let source: string;
  try {
    source = readFileSync(file, 'utf8');
  } catch {
    // Fails soft. A missing or unreadable body is already a real failure that
    // the content gate and the module registry both catch by name; breaking the
    // production build over a navigation aid would be the wrong trade.
    return [];
  }

  const entries: TocEntry[] = [];
  let inFence = false;

  for (const line of source.split(/\r?\n/)) {
    // A `##` inside a fenced block is code, not a section.
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    // `##` only. Sub-headings still get anchors so they can be linked to, but a
    // rail that lists every h3 stops being scannable, which is the one thing it
    // is for.
    // `\s+` after the two hashes is what rejects `###` — the third hash is not
    // whitespace, so a sub-heading simply does not match.
    const match = /^##\s+(.+?)\s*$/.exec(line);
    if (!match) continue;

    const text = markdownHeadingText(match[1]!);
    if (text) entries.push({ id: slugify(text), text });
  }

  return entries;
}
