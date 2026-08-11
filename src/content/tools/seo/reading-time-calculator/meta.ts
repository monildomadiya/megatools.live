import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'reading-time-calculator',
  category: 'seo',
  name: 'Reading Time Calculator',
  h1: 'Reading Time Calculator',
  metaTitle: 'Reading Time Calculator — Based on Real Data',
  metaDescription:
    'Estimate how long text takes to read, silently or aloud, using reading rates from published research rather than the 200 words per minute everyone repeats.',
  shortDescription:
    'Estimate how long a piece of text takes to read silently or aloud, using rates from published research rather than folklore.',
  leadAnswer:
    'Reading time is word count divided by reading rate. The rate is where estimates go wrong: a 2019 meta-analysis of 190 studies put silent reading of English non-fiction at about 238 words per minute, not the 200 that most tools use without citing anything at all.',
  keywords: [
    'reading time calculator',
    'words per minute reading',
    'how long to read',
    'speech time calculator',
    'article read time',
    'words to minutes',
  ],
  faqs: [
    {
      question: 'What reading speed should I use?',
      answer:
        'For silent reading of English non-fiction, about 238 words per minute is the best-supported figure — it comes from a 2019 meta-analysis by Marc Brysbaert covering 190 studies and more than 18,000 participants. Fiction runs faster at around 260, because the language is more predictable. Reading aloud is far slower, around 150 to 160, because speech rate rather than comprehension sets the limit.',
    },
    {
      question: 'Why do most reading time estimates use 200 words per minute?',
      answer:
        'Convention, mostly, traced back to older and smaller studies and then copied between tools without anyone rechecking it. It is not absurd — it sits within the range of real readers — but it is a round number that acquired authority through repetition rather than evidence, and it will overstate reading time for most adults by roughly 15 percent.',
    },
    {
      question: 'How long does it take to read 1,000 words?',
      answer:
        'About four minutes and ten seconds silently at 238 words per minute. Read aloud at 150 it takes about six minutes and forty seconds. That gap is why a script and an article of the same length are completely different pieces of work, and why writing for the ear needs a word budget of roughly two thirds what the page would take.',
    },
    {
      question: 'How many words is a five minute speech?',
      answer:
        'Roughly 750 at a comfortable delivery rate of 150 words per minute. Speaking faster than about 160 starts to cost the audience comprehension, and most people speed up under nerves, so writing to 140 and delivering calmly is safer than writing to 160 and hoping. Set the rate to 150 and work backwards from your target duration.',
    },
    {
      question: 'Does reading speed vary between people?',
      answer:
        'Considerably. The meta-analysis found the middle 95 percent of readers spanning roughly 175 to 300 words per minute for non-fiction, so any single figure is a midpoint and not a prediction about any one reader. Age, familiarity with the subject, and whether the text is being read for detail or skimmed all move it substantially.',
    },
    {
      question: 'Are speed reading claims of 1,000 words a minute real?',
      answer:
        'Not with comprehension intact. The research consistently finds that beyond roughly 400 to 500 words per minute, what is happening is skimming — sampling the text and inferring the rest — and measured comprehension falls accordingly. Skimming is a genuinely useful skill and worth having. It is not reading faster, and the trade is real.',
    },
    {
      question: 'Should I show a reading time on my articles?',
      answer:
        'It is generally worth it, and worth being honest with. A visible estimate helps a reader decide whether to start now or save it, which is a decision they are making regardless. Be aware the number sets an expectation: label a fifteen minute piece as four and you have not gained a reader, you have annoyed one. Round up rather than down.',
    },
  ],
  sources: [
    {
      title: 'How many words do we read per minute? A review and meta-analysis of reading rate (2019)',
      publisher: 'Marc Brysbaert, Journal of Memory and Language',
      url: 'https://doi.org/10.1016/j.jml.2019.104047',
    },
    {
      title: 'Standardized assessment of reading performance: the New International Reading Speed Texts IReST (2012)',
      publisher: 'Trauzettel-Klosinski & Dietz, Investigative Ophthalmology & Visual Science',
      url: 'https://doi.org/10.1167/iovs.11-8284',
    },
    {
      title: 'So much to read, so little time: how do we read, and can speed reading help? (2016)',
      publisher: 'Rayner et al., Psychological Science in the Public Interest',
      url: 'https://doi.org/10.1177/1529100615623267',
    },
  ],
  relatedSlugs: ['seo/word-counter', 'seo/readability-calculator'],
  publishedAt: '2026-08-11',
  updatedAt: '2026-08-11',
};

export default meta;
