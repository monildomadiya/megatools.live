import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'week-number-calculator',
  category: 'date-time',
  name: 'Week Number Calculator',
  h1: 'Week Number Calculator',
  metaTitle: 'Week Number Calculator — ISO 8601 Week of the Year',
  metaDescription:
    'Find the ISO 8601 week number for any date, or the dates covered by any week — with the week-based year, the 53-week years and the US convention shown too.',
  shortDescription:
    'Get the ISO 8601 week number for a date, or the Monday-to-Sunday dates a given week covers.',
  leadAnswer:
    'An ISO 8601 week runs Monday to Sunday, and week 01 of a year is the week containing that year’s first Thursday. That rule makes every week belong to exactly one year, at the cost of the first days of January sometimes falling in the last week of the year before.',
  keywords: [
    'week number calculator',
    'iso week number',
    'what week is it',
    'current week number',
    'iso 8601 week date',
    'week number to date',
  ],
  faqs: [
    {
      question: 'How is the ISO week number defined?',
      answer:
        'Weeks run Monday to Sunday, and week 01 is the week containing the first Thursday of January. An equivalent statement of the same rule is that week 01 is the week containing 4 January, or the week holding the majority of its days in the new year. All three definitions pick out the same seven days; the Thursday version is the easiest to apply by hand.',
    },
    {
      question: 'Why does 1 January sometimes fall in week 52 or 53?',
      answer:
        'Because a week cannot be split between two years and still be a week. If 1 January is a Friday, Saturday or Sunday, most of that week lies in December, so the whole week belongs to the outgoing year and the new year starts at week 01 a few days later. The reverse also happens: 29, 30 and 31 December can fall in week 01 of the following year.',
    },
    {
      question: 'What is the week-based year, and why does it matter?',
      answer:
        'It is the year the week belongs to, which is not always the calendar year of the date. 1 January 2027 sits in week 53 of week-based year 2026. Formatting a date as year plus week number using the calendar year produces 2027-W53, a week that does not exist, and this is a real and recurring software bug — date libraries provide a separate week-based-year field precisely to avoid it.',
    },
    {
      question: 'Which years have 53 weeks?',
      answer:
        'A year has 53 ISO weeks when 1 January falls on a Thursday, or when it falls on a Wednesday in a leap year. Every other year has 52. That works out to 71 long years in every 400, roughly one year in six. Weekly payrolls and weekly reporting cycles have to plan for the extra period, because it arrives on schedule and still surprises people.',
    },
    {
      question: 'Is the US week numbering different?',
      answer:
        'Yes, and mixing them is a common source of off-by-one disputes. The common North American convention starts weeks on Sunday and makes week 1 the week containing 1 January, so a partial week at the start of the year still counts as week 1. That numbering runs a week ahead of the ISO figure for much of the year. Both are shown here so the difference is visible rather than argued about.',
    },
    {
      question: 'Who actually uses week numbers?',
      answer:
        'European manufacturing and logistics run on them almost universally — delivery dates, production schedules and project plans are quoted as a week rather than a date. They are also standard in retail planning, academic timetabling in much of Europe, and in tyre manufacturing, where the four-digit DOT code on a sidewall gives the week and year the tyre was made.',
    },
    {
      question: 'How do I get the dates a week number covers?',
      answer:
        'Take the Monday of the week containing 4 January, which is always the first day of week 01, then add seven days for each further week. Entering a year and a week here does exactly that and shows the Monday to Sunday range. Note that a week number without a year is ambiguous, and a week 53 exists only in years that have one.',
    },
  ],
  sources: [
    {
      title: 'ISO 8601-1:2019 — Date and time representations for information interchange, Part 1: Basic rules',
      publisher: 'International Organization for Standardization (ISO)',
      url: 'https://www.iso.org/standard/70907.html',
    },
    {
      title: 'Unicode Technical Standard #35, Part 4 — Week Data and the week-based year pattern field',
      publisher: 'Unicode Consortium (CLDR)',
      url: 'https://www.unicode.org/reports/tr35/tr35-dates.html#Week_Data',
    },
    {
      title: 'Tire Identification Number — the DOT date code giving week and year of manufacture',
      publisher: 'US National Highway Traffic Safety Administration (NHTSA)',
      url: 'https://www.nhtsa.gov/tires/tire-safety-basics',
    },
  ],
  relatedSlugs: ['developer/unix-timestamp-converter', 'date-time/business-days-calculator'],
  publishedAt: '2026-08-12',
  updatedAt: '2026-08-12',
};

export default meta;
