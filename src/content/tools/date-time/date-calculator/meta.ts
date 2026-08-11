import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'date-calculator',
  category: 'date-time',
  name: 'Date Calculator',
  h1: 'Date Calculator',
  metaTitle: 'Date Calculator — Add or Subtract From a Date',
  metaDescription:
    'Add or subtract days, weeks, months or years from any date and see the result with its weekday. Month-end clamping and leap years are handled and explained.',
  shortDescription:
    'Add or subtract days, weeks, months or years from a date, with the weekday shown and month-end clamping stated rather than hidden.',
  leadAnswer:
    'Adding days to a date is unambiguous — count forward on the calendar. Adding months is not: 31 January plus one month has no 31 February to land on, so every system clamps it back to the 28th or 29th. Knowing which rule applies matters whenever a deadline falls at a month end.',
  keywords: [
    'date calculator',
    'add days to date',
    'subtract days from date',
    '90 days from today',
    'date plus months calculator',
    'what date will it be',
  ],
  faqs: [
    {
      question: 'What is 90 days from today?',
      answer:
        'Set the start date to today, choose add, enter 90 and select days. The result counts every calendar day including weekends and public holidays. If you need 90 working days instead — which is a common reading of a legal or contractual deadline — use the business days calculator, because the two answers differ by roughly five weeks.',
    },
    {
      question: 'What happens when I add a month to the 31st?',
      answer:
        'The result is clamped to the last day of the target month. 31 January plus one month gives 28 February, or 29 February in a leap year. There is no universally correct answer here because 31 February does not exist, and clamping to the month end is the convention almost every calendar system and contract uses. This tool tells you on screen when a clamp has happened.',
    },
    {
      question: 'Is adding a month the same as adding 30 days?',
      answer:
        'No, and treating them as equivalent is the most common source of date errors. Months are between 28 and 31 days long, so adding one month to 1 January gives 1 February, while adding 30 days gives 31 January. Over a year the two methods drift by five to six days. Contracts and notice periods almost always mean calendar months, not fixed 30-day blocks.',
    },
    {
      question: 'Does the calculation include the start date?',
      answer:
        'No. Adding one day to 10 March gives 11 March, not 10 March. This is the convention for date arithmetic, but it differs from how some notice periods are counted, where "within 14 days" may include the day the notice was served. If a deadline matters legally, check which counting rule the document specifies rather than assuming.',
    },
    {
      question: 'How are leap years handled?',
      answer:
        'By the Gregorian rule, applied automatically. A year is a leap year when it is divisible by 4, except that centuries are not leap years unless divisible by 400. So 2024 and 2000 have a 29 February while 1900 and 2100 do not. Adding one year to 29 February gives 28 February in a non-leap year, which is the same clamp that applies at any month end.',
    },
    {
      question: 'Why does the weekday matter?',
      answer:
        'Because a deadline landing on a Saturday or Sunday is usually not the deadline. Many contracts, court rules and payment terms roll a due date forward to the next working day, and knowing the weekday of the result is what tells you whether that rule is about to apply. The weekday is shown for every result for that reason.',
    },
    {
      question: 'Can I use dates before 1582?',
      answer:
        'The tool will calculate them, but read the result carefully. The Gregorian calendar was introduced in 1582 and adopted at wildly different dates by different countries — Britain and its colonies not until 1752, when eleven days were dropped. Dates before adoption are calculated proleptically, meaning the modern rules are projected backwards onto a period that did not use them. For historical work that is usually not what you want.',
    },
  ],
  sources: [
    {
      title: 'ISO 8601 — Date and time format',
      publisher: 'International Organization for Standardization (ISO)',
      url: 'https://www.iso.org/iso-8601-date-and-time-format.html',
    },
    {
      title: 'RFC 3339 — Date and Time on the Internet: Timestamps',
      publisher: 'Internet Engineering Task Force (IETF)',
      url: 'https://www.rfc-editor.org/rfc/rfc3339.html',
    },
    {
      title: 'Leap Years — the Gregorian rule and why it exists',
      publisher: 'Royal Museums Greenwich',
      url: 'https://www.rmg.co.uk/stories/topics/leap-year',
    },
  ],
  relatedSlugs: ['date-time/business-days-calculator', 'date-time/date-difference-calculator'],
  publishedAt: '2026-08-11',
  updatedAt: '2026-08-11',
};

export default meta;
