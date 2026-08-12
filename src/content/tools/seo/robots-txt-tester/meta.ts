import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'robots-txt-tester',
  category: 'seo',
  name: 'Robots.txt Tester',
  h1: 'Robots.txt Tester',
  metaTitle: 'Robots.txt Tester — Check a URL Against Your Rules',
  metaDescription:
    'Paste a robots.txt and a URL to see whether a crawler is allowed, which rule decided it, and why longest-match precedence often surprises people.',
  shortDescription:
    'Check any URL against a robots.txt and see exactly which rule allowed or blocked it, and why.',
  leadAnswer:
    'A robots.txt file tells crawlers which paths they may request. It is grouped by user-agent, each group holding allow and disallow rules, and the rule with the longest matching path wins rather than the first one written. It controls crawling only — never indexing, and never access.',
  keywords: [
    'robots.txt tester',
    'robots txt checker',
    'robots.txt validator',
    'disallow rule tester',
    'crawler blocking test',
    'robots exclusion protocol',
  ],
  faqs: [
    {
      question: 'Which rule wins when several match?',
      answer:
        'The most specific one, measured by the length of the path pattern — not the order they are written in. If an allow and a disallow rule match with equal length, the allow wins. That is the rule in RFC 9309 and the behaviour Google documents, and it is why a broad disallow followed by a narrower allow works, while people expecting first-match-wins get surprised.',
    },
    {
      question: 'Does disallow remove a page from Google?',
      answer:
        'No. Disallow stops a page being crawled, not indexed. A blocked URL can still appear in results, usually with no description, if Google learns of it from links elsewhere. To keep a page out of the index you need a noindex meta tag or header — which requires the page to be crawlable, so blocking it in robots.txt actively prevents the removal you wanted.',
    },
    {
      question: 'Can I use noindex in robots.txt?',
      answer:
        'No. Google supported an undocumented noindex directive in robots.txt for years and stopped honouring it on 1 September 2019. It is not part of the standard and never was. Lines using it are ignored, so a file relying on one is doing nothing at all — use a robots meta tag, an X-Robots-Tag header, or authentication instead.',
    },
    {
      question: 'What wildcards are supported?',
      answer:
        'Two, and only in path patterns. An asterisk matches any sequence of characters, and a dollar sign anchors the pattern to the end of the URL. So a rule disallowing a path ending in .pdf needs the dollar; without it, the pattern also matches a URL where .pdf is followed by a query string. Both are supported by the major crawlers and are now in the standard.',
    },
    {
      question: 'Is crawl-delay respected?',
      answer:
        'By some crawlers, not by Google. It is not part of the standard, though Bing and Yandex have historically honoured it. Google ignores it entirely and sets crawl rate from its own signals about server response. A file relying on crawl-delay to protect an origin is relying on something most of its traffic will not read.',
    },
    {
      question: 'Does robots.txt protect anything?',
      answer:
        'Nothing whatsoever. It is a public file at a predictable address, it is advisory, and well-behaved crawlers obey it while anything malicious reads it as a map. Listing an admin path in a disallow rule publishes that the path exists. Genuine protection is authentication, or not serving the content at all.',
    },
    {
      question: 'Where must the file live?',
      answer:
        'At the root of the origin, as /robots.txt, and each scheme, host and port is a separate origin with its own file. The rules for https://example.com do not cover http://example.com, a subdomain, or a different port. A file at any other path is ignored, and a 404 for it is treated as full permission to crawl.',
    },
  ],
  sources: [
    {
      title: 'RFC 9309 — Robots Exclusion Protocol',
      publisher: 'Internet Engineering Task Force (IETF)',
      url: 'https://www.rfc-editor.org/rfc/rfc9309.html',
    },
    {
      title: 'How Google interprets the robots.txt specification',
      publisher: 'Google Search Central documentation',
      url: 'https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt',
    },
    {
      title: 'Block search indexing with noindex',
      publisher: 'Google Search Central documentation',
      url: 'https://developers.google.com/search/docs/crawling-indexing/block-indexing',
    },
  ],
  relatedSlugs: ['seo/serp-snippet-preview', 'seo/domain-age-checker'],
  publishedAt: '2026-08-12',
  updatedAt: '2026-08-12',
};

export default meta;
