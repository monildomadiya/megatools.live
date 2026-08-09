import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'character-counter',
  category: 'seo',
  name: 'Character Counter',
  h1: 'Character Counter',
  metaTitle: 'Character Counter — Graphemes, Bytes & Limits',
  metaDescription:
    'Count characters with and without spaces, plus code points, grapheme clusters and UTF-8 bytes — and check your text against SERP, social and SMS limits.',
  shortDescription:
    'Count characters four different ways — including how emoji actually count — and check the result against real platform limits.',
  leadAnswer:
    'A character has at least three technical meanings. A family emoji is one thing you see, seven Unicode code points, and eleven UTF-16 code units. JavaScript reports code units, most databases count code points, and a person counts what they can see — which is why two tools disagree.',
  keywords: [
    'character counter',
    'character count',
    'count characters online',
    'letter counter',
    'twitter character counter',
    'meta description length checker',
  ],
  faqs: [
    {
      question: 'Why do different tools give different character counts?',
      answer:
        'Because "character" has at least three technical meanings. A family emoji is one thing you see, but it is seven Unicode code points and eleven UTF-16 code units. JavaScript’s string length reports code units, most databases count code points, and a human counts what they can see. This page shows all of them so you can tell which one a given platform is applying.',
    },
    {
      question: 'What is a grapheme cluster?',
      answer:
        'It is what Unicode calls a user-perceived character — the unit you would delete with one press of backspace. Defined in Unicode Standard Annex #29, it groups a base character with its combining marks, so an accented letter, a flag, or a skin-toned emoji counts as one regardless of how many code points build it. It is the count that matches human intuition.',
    },
    {
      question: 'Is there really a 60-character limit on SEO titles?',
      answer:
        'No. Google’s own documentation states there is no limit on the length of a title element, and that the title link is truncated in results as needed, typically to fit the device width. The constraint is pixel width, not character count, so a title full of narrow letters survives longer than one full of capitals. Around 60 characters is a useful rule of thumb, not a rule.',
    },
    {
      question: 'How long should a meta description be?',
      answer:
        'Google states there is no limit and that snippets are truncated to fit the device width. In practice descriptions run to roughly 155 to 160 characters on desktop before being cut. Google also frequently generates its own snippet from page content when it judges that a better match for the query, so the meta description is a suggestion rather than a guarantee.',
    },
    {
      question: 'Why does one emoji use up more than one character on Twitter or X?',
      answer:
        'Most platforms count code points rather than what you see. A single emoji is usually one code point, but a skin-toned or combined emoji is several joined by zero-width joiners — a family emoji can consume seven. Flags are two regional indicator symbols each. If a post is close to the limit, emoji are a more expensive way to save space than they look.',
    },
    {
      question: 'Why do some SMS messages fit 160 characters and others only 70?',
      answer:
        'A standard SMS encodes text in a 7-bit alphabet that holds 160 characters per message. That alphabet covers basic Latin letters and a small set of symbols. The moment you include anything outside it — an emoji, a curly quote, most accented letters — the whole message switches to 16-bit encoding and the limit drops to 70. A single smart quote pasted from a word processor can therefore double the cost of a bulk send.',
    },
    {
      question: 'What is the difference between characters and bytes?',
      answer:
        'In UTF-8, a character occupies between one and four bytes. Basic Latin letters take one, most Latin accented letters and Greek or Cyrillic take two, most Chinese, Japanese and Korean take three, and emoji take four. Database column limits and API payload limits are frequently specified in bytes, which is why a field that accepts 255 English characters may reject far fewer in another script.',
    },
    {
      question: 'Does the counter include spaces and line breaks?',
      answer:
        'The main count does, because that is what platform limits count. The page also reports a figure excluding whitespace, which is the one usually wanted for academic and editorial limits where "characters excluding spaces" is specified. Line breaks count as characters too, and on some platforms a newline consumes two.',
    },
  ],
  sources: [
    {
      title: 'Unicode Standard Annex #29 — Unicode Text Segmentation',
      publisher: 'The Unicode Consortium',
      url: 'https://unicode.org/reports/tr29/',
    },
    {
      title: 'Influencing your title links in search results',
      publisher: 'Google Search Central',
      url: 'https://developers.google.com/search/docs/appearance/title-link',
    },
    {
      title: 'Control your snippets in search results',
      publisher: 'Google Search Central',
      url: 'https://developers.google.com/search/docs/appearance/snippet',
    },
  ],
  relatedSlugs: ['seo/word-counter', 'seo/slug-generator'],
  publishedAt: '2026-08-07',
  updatedAt: '2026-08-09',
};

export default meta;
