import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'time-zone-converter',
  category: 'date-time',
  name: 'Time Zone Converter',
  h1: 'Time Zone Converter',
  metaTitle: 'Time Zone Converter — Compare Times Across Cities',
  metaDescription:
    'Convert a time between cities and see it in every zone at once, with daylight saving applied for the date you pick rather than for today.',
  shortDescription:
    'Convert a time between cities with daylight saving applied for the date you actually chose, and see the same moment in every zone at once.',
  leadAnswer:
    'A time zone is a rule rather than a fixed offset: New York is UTC−5 in winter and UTC−4 in summer. Because countries change their clocks on different weekends, the gap between two cities is not constant — London and New York are five hours apart most of the year and four for part of March.',
  keywords: [
    'time zone converter',
    'world clock',
    'utc converter',
    'est to gmt',
    'meeting time across time zones',
    'daylight saving converter',
  ],
  faqs: [
    {
      question: 'Why does the offset change depending on the date I pick?',
      answer:
        'Because daylight saving does not apply all year, and the changeover dates differ between countries. New York is UTC−5 in January and UTC−4 in July. London is UTC+0 and UTC+1. Since the EU and the US switch on different weekends, there are two or three weeks each spring and autumn when the usual five-hour gap between London and New York becomes four or six. This converter applies the rules for the date you entered, which is why scheduling a meeting for next March needs next March’s date, not today’s.',
    },
    {
      question: 'What is the difference between UTC and GMT?',
      answer:
        'For everyday purposes they are the same, and they never differ by more than 0.9 seconds. UTC is the modern standard, defined by atomic clocks and kept in step with the Earth’s rotation by occasional leap seconds. GMT is a time zone based on the mean solar time at the Greenwich meridian, and in the UK it also means specifically winter time — Britain is on GMT in January and BST in July, so "GMT" is ambiguous in a way "UTC" is not. Use UTC in anything technical.',
    },
    {
      question: 'Why should I not use time zone abbreviations like CST?',
      answer:
        'Because they are ambiguous. CST is Central Standard Time in North America (UTC−6), China Standard Time (UTC+8), and Cuba Standard Time (UTC−5). IST is India (UTC+5:30), Ireland (UTC+1) and Israel (UTC+2). There is no registry that makes these unique. IANA identifiers such as America/Chicago and Asia/Shanghai are unambiguous, which is why every operating system and database uses them internally and why this tool labels zones by city.',
    },
    {
      question: 'Do all time zones differ by whole hours?',
      answer:
        'No. India is UTC+5:30, Iran UTC+3:30, Afghanistan UTC+4:30, Myanmar UTC+6:30, and the Chatham Islands are UTC+12:45. Nepal is UTC+5:45, the only 45-minute offset on a national scale. Half-hour and quarter-hour offsets exist because a zone was set to the local solar time of a capital rather than rounded to the nearest hour.',
    },
    {
      question: 'What happens to the hour that does not exist?',
      answer:
        'When the clocks spring forward, a wall-clock hour is skipped entirely — in the US, 02:30 does not exist on the changeover date. When they fall back, an hour repeats, so 01:30 happens twice and is genuinely ambiguous. This converter flags a time that does not exist rather than silently shifting it. It is also why scheduling anything for the small hours of a changeover date is a bad idea.',
    },
    {
      question: 'How wide can a country’s time span be?',
      answer:
        'China spans five geographic time zones but keeps a single official time, UTC+8, so the sun rises around 10 a.m. in the far west of Xinjiang. Russia has eleven zones, the United States has six including Hawaii and Alaska, and France, counting overseas territories, has twelve — more than any other country. A country and a time zone are not the same unit.',
    },
    {
      question: 'Where do the time zone rules actually come from?',
      answer:
        'The IANA Time Zone Database, also called tz or zoneinfo. It is a public dataset recording every offset and daylight saving rule change back to 1970, maintained collaboratively and released several times a year as governments announce changes. Every major operating system, browser and database ships a copy. When a country abolishes daylight saving at short notice — which happens most years somewhere — the fix is a tzdata release, and software that has not updated will be wrong.',
    },
  ],
  sources: [
    {
      title: 'Time Zone Database (tz / zoneinfo)',
      publisher: 'Internet Assigned Numbers Authority (IANA)',
      url: 'https://www.iana.org/time-zones',
    },
    {
      title: 'Coordinated Universal Time (UTC) and leap seconds',
      publisher: 'Bureau International des Poids et Mesures (BIPM)',
      url: 'https://www.bipm.org/en/time-metrology/utc',
    },
    {
      title: 'Uniform Time Act and daylight saving time in the United States',
      publisher: 'US Department of Transportation',
      url: 'https://www.transportation.gov/regulations/daylight-saving-time',
    },
  ],
  relatedSlugs: ['date-time/date-difference-calculator'],
  publishedAt: '2026-08-09',
  updatedAt: '2026-08-09',
};

export default meta;
