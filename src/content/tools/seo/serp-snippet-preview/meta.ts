import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'serp-snippet-preview',
  category: 'seo',
  name: 'SERP Snippet Preview',
  h1: 'SERP Snippet Preview & Pixel Width Checker',
  metaTitle: 'SERP Snippet Preview — Title Pixel Width Checker',
  metaDescription:
    'Preview how a title and meta description will appear in search results, measured in pixels rather than characters — the way truncation is actually decided.',
  shortDescription:
    'See how a title and description will render in search results, measured in pixels rather than characters.',
  leadAnswer:
    'A search snippet is the title link, URL and description shown for a page in a results list. Truncation is decided by pixel width, not character count, so a title of narrow letters survives where an equally long one in capitals is cut. Google also rewrites titles when it judges another wording to fit the query better.',
  keywords: [
    'serp snippet preview',
    'title tag length checker',
    'meta description length',
    'serp preview tool',
    'title pixel width',
    'google snippet preview',
  ],
  faqs: [
    {
      question: 'Is there a character limit for a title tag?',
      answer:
        'No. Google has stated repeatedly that there is no character limit on a title element, and that snippets are truncated to fit the available width on the device showing them. The familiar figures of around 60 characters and 155 characters are conventions derived from typical pixel widths, not rules. Measuring the rendering width is closer to what actually happens, which is what this page does.',
    },
    {
      question: 'Why do two titles of the same length truncate differently?',
      answer:
        'Because letters are different widths. In the proportional font Google renders results in, a lowercase i is roughly a quarter the width of a capital W. A title in title case with several narrow letters can run well past sixty characters intact, while one in capitals is cut before it gets there. Any tool counting characters is measuring the wrong thing.',
    },
    {
      question: 'How accurate is the pixel measurement here?',
      answer:
        'It is close but not exact. The measurement uses your browser to render the same font family and sizes Google uses on desktop results, so it lands within a few pixels for ordinary Latin text. It cannot account for Google substituting a different font for scripts your device renders differently, for the extra elements that appear on some results, or for the range of widths across real devices. Treat the figure as a good guide rather than a guarantee.',
    },
    {
      question: 'Why does Google show a different title from the one I wrote?',
      answer:
        'Because it may use other text from the page when it judges the title element to be a poor match for the query — text from headings, from the anchor text of links, or from prominent on-page text. Independent studies have found rewriting on a substantial minority of results. The remedy is a title element that is descriptive, unique to the page, and not padded with boilerplate or keyword repetition.',
    },
    {
      question: 'Does a meta description affect ranking?',
      answer:
        'Not directly — Google has confirmed that meta descriptions are not a ranking factor. It affects whether a result is clicked, which is the reason to write one. Google also generates descriptions from page content when the supplied one does not fit the query, and frequently prefers its own version, so treat the description as a strong suggestion rather than fixed text.',
    },
    {
      question: 'Do the mobile and desktop widths differ?',
      answer:
        'Yes. Mobile results are narrower but wrap to more lines, and the layout, font sizes and the amount of description shown all differ from desktop. The desktop figures shown here are the conventional check because they are the tighter constraint on the title, but a title that matters should be looked at on a phone as well.',
    },
    {
      question: 'What should go at the front of a title?',
      answer:
        'The words a searcher is looking for. Truncation removes the end, so anything at the front survives on every device and in every layout, while a brand name repeated after a pipe character is the first thing lost. That is a good ordering anyway: the distinguishing words identify the page, and the site name adds nothing that the URL beneath does not already show.',
    },
  ],
  sources: [
    {
      title: 'Control your title links in search results',
      publisher: 'Google Search Central documentation',
      url: 'https://developers.google.com/search/docs/appearance/title-link',
    },
    {
      title: 'Control your snippets in search results',
      publisher: 'Google Search Central documentation',
      url: 'https://developers.google.com/search/docs/appearance/snippet',
    },
    {
      title: 'Google Search Essentials — how Search works with the content of a page',
      publisher: 'Google Search Central documentation',
      url: 'https://developers.google.com/search/docs/essentials',
    },
  ],
  relatedSlugs: ['seo/character-counter', 'seo/slug-generator'],
  publishedAt: '2026-08-12',
  updatedAt: '2026-08-12',
};

export default meta;
