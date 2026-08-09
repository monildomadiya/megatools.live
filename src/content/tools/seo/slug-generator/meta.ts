import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'slug-generator',
  category: 'seo',
  name: 'Slug Generator',
  h1: 'URL Slug Generator',
  metaTitle: 'Slug Generator — Clean URLs from Any Title',
  metaDescription:
    'Turn any title into a clean URL slug: accents transliterated, punctuation stripped, words hyphenated, with optional stop-word removal and a length cap.',
  shortDescription:
    'Turn a title into a clean, safe URL slug — accents transliterated and punctuation handled properly.',
  leadAnswer:
    'A URL slug is the human-readable part of a web address that identifies a page — the “slug-generator” in this address. Good slugs are lowercase, short, and hyphen-separated, using only characters that survive being copied, shared and pasted without being mangled into percent-encoding.',
  keywords: [
    'slug generator',
    'url slug generator',
    'permalink generator',
    'seo friendly url',
    'text to slug',
    'slugify',
  ],
  faqs: [
    {
      question: 'What is a URL slug?',
      answer:
        'The slug is the human-readable part of a URL that identifies a specific page — the "url-slug-generator" in this page’s own address. A good slug is short, describes the content, and uses only characters that survive being copied, shared and pasted without being mangled into percent-encoding.',
    },
    {
      question: 'Should I use hyphens or underscores?',
      answer:
        'Hyphens. Google’s URL structure documentation recommends hyphens over underscores to separate words, because underscores have a long history of joining words in programming identifiers rather than separating them. Both are legal characters in a URL, so this is a convention rather than a technical constraint — but it is the convention search engines were built around.',
    },
    {
      question: 'Which characters are actually safe in a URL?',
      answer:
        'RFC 3986 defines the unreserved set as letters, digits, hyphen, period, underscore and tilde. Anything else either has a reserved structural meaning — such as the slash, question mark or hash — or must be percent-encoded. In practice a slug should stick to lowercase letters, digits and hyphens, which avoids every ambiguity at once.',
    },
    {
      question: 'Why should slugs be lowercase?',
      answer:
        'Because the path portion of a URL is case-sensitive on most servers while domain names are not. That means /About-Us and /about-us can be two different pages, which splits link equity and creates duplicate content. Standardising on lowercase removes an entire class of problem, and it also stops the same URL being typed two ways.',
    },
    {
      question: 'Should I remove stop words like "the" and "of"?',
      answer:
        'Sometimes. Removing them shortens the slug and raises the density of meaningful words, which is why the option exists. But it can also destroy meaning — "the-who" and "who" are different bands, and "war-of-the-worlds" reads better than "war-worlds". Use it on long titles, check the result, and keep the stop word wherever it is load-bearing.',
    },
    {
      question: 'What happens to accented and non-Latin characters?',
      answer:
        'This tool transliterates accented Latin characters to their base letters, so "café" becomes "cafe". Non-Latin scripts are a genuine choice: modern browsers display them correctly in the address bar, but they are percent-encoded when copied, so a Cyrillic or Chinese slug pasted into an email becomes an unreadable string. Transliteration is the safer default for anything likely to be shared as text.',
    },
    {
      question: 'How long should a slug be?',
      answer:
        'Long enough to describe the page and no longer. Three to five meaningful words is a good target. There is no search penalty for a long slug, but long URLs get truncated in search results and in social previews, and they are harder to read and to share. The length cap here trims at a word boundary rather than mid-word.',
    },
    {
      question: 'Can I change a slug after publishing?',
      answer:
        'You can, but the old URL must then redirect permanently to the new one, or you lose every link and every ranking signal pointing at it. Treat a published slug as expensive to change. If you must, set up a 301 redirect at the same time you make the change rather than afterwards.',
    },
  ],
  sources: [
    {
      title: 'RFC 3986 — Uniform Resource Identifier (URI): Generic Syntax',
      publisher: 'Internet Engineering Task Force (IETF)',
      url: 'https://www.rfc-editor.org/rfc/rfc3986',
    },
    {
      title: 'Keep a simple URL structure',
      publisher: 'Google Search Central',
      url: 'https://developers.google.com/search/docs/crawling-indexing/url-structure',
    },
    {
      title: 'URL — Living Standard',
      publisher: 'WHATWG',
      url: 'https://url.spec.whatwg.org/',
    },
  ],
  relatedSlugs: ['seo/character-counter', 'seo/word-counter'],
  publishedAt: '2026-08-07',
  updatedAt: '2026-08-09',
};

export default meta;
