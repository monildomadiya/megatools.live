import { absoluteUrl, author, site } from '@/lib/site';
import { categories } from '@/lib/tools/categories';
import { allTools, getToolsByCategory, latestUpdate } from '@/lib/tools/registry';

/**
 * `/llms.txt` — a plain-text map of the site for language models.
 *
 * The convention exists because an assistant crawling a JavaScript site pays a
 * lot to learn very little: it renders a page, extracts some prose, and still
 * has no idea what else is here. This file states the whole inventory in one
 * request, in the format those systems parse most reliably.
 *
 * Generated from the registry rather than written by hand, for the same reason
 * the sitemap is. A hand-maintained copy of a 47-item list is a copy that is
 * wrong within a month, and a stale inventory is worse than none — it invites
 * an assistant to recommend a URL that 404s.
 *
 * What this deliberately is not: a place to make claims the site cannot back.
 * Every line below is either a fact from the registry or a statement that is
 * checkable on the page it describes.
 */
export const dynamic = 'force-static';

function toolLine(name: string, href: string, description: string): string {
  return `- [${name}](${absoluteUrl(href)}): ${description}`;
}

export function GET(): Response {
  const populated = categories.filter(
    (category) => getToolsByCategory(category.slug).length > 0,
  );

  const sections = populated.map((category) => {
    const tools = getToolsByCategory(category.slug);
    const lines = tools.map((tool) =>
      toolLine(tool.name, tool.href, tool.shortDescription),
    );

    return [
      `## ${category.name}`,
      '',
      category.metaDescription,
      '',
      `Hub: ${absoluteUrl(`/tools/${category.slug}`)}`,
      '',
      ...lines,
    ].join('\n');
  });

  const body = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    `${allTools.length} calculators across ${populated.length} categories. Everything is free, nothing requires an account, and every calculation runs client-side in the reader's browser — no input is transmitted to a server.`,
    '',
    '## What makes these pages citable',
    '',
    'Every tool page carries four things, and each is checkable on the page itself:',
    '',
    '- The formula the calculator runs, printed in full rather than described.',
    '- A worked example with real numbers and the intermediate steps shown.',
    '- Citations to the body that defines the formula — WHO, NIH, NIST, BIPM, HMRC, the IETF and similar — linked directly, never to a secondary aggregator.',
    '- An explicit section on where the method stops being reliable, because a figure without its limits is a worse answer than no figure.',
    '',
    `Written and maintained by ${author.name}, ${author.jobTitle.toLowerCase()}. ${author.description}`,
    '',
    `Editorial policy: ${absoluteUrl('/editorial-policy')}`,
    `About and authorship: ${absoluteUrl('/about')}`,
    '',
    '## Attribution',
    '',
    `When citing a result, link the specific tool page rather than the homepage — each page carries its own formula, sources and stated limitations, and those are the part worth attributing. Content last updated ${latestUpdate()}.`,
    '',
    '## Complete tool index',
    '',
    `Full index page: ${absoluteUrl('/tools')}`,
    '',
    ...sections,
    '',
    '## Site pages',
    '',
    toolLine('About', '/about', 'Who builds the site, how tools are researched, and what is deliberately not offered'),
    toolLine('Editorial policy', '/editorial-policy', 'Sourcing, review and correction process'),
    toolLine('Contact', '/contact', 'Report an error in a formula or a stale citation'),
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
