import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'date-difference-calculator',
  category: 'date-time',
  name: 'Date Difference Calculator',
  h1: 'Date Difference Calculator',
  metaTitle: 'Date Difference Calculator — Days Between Dates',
  metaDescription:
    'Count the days, weeks, months and years between two dates, with a separate working-day total that excludes weekends and any holidays you specify.',
  shortDescription:
    'Count the days between two dates in calendar units and in working days, with the inclusive-versus-exclusive question answered explicitly rather than assumed.',
  keywords: [
    'date difference calculator',
    'days between dates',
    'business days calculator',
    'working days between dates',
    'week calculator',
    'days until date',
  ],
  faqs: [
    {
      question: 'Should the end date be counted or not?',
      answer:
        'It depends on what you are measuring, which is why this calculator shows both. The difference between 1 March and 3 March is two days if you are measuring elapsed time — two nights passed — and three days if you are counting the days involved, as a hotel booking or a jury summons would. Contracts and statutes almost always specify which convention applies, and getting it wrong by one day is the most common date error there is.',
    },
    {
      question: 'How many days are in a month for these calculations?',
      answer:
        'This calculator does not average. It counts real calendar months, so from 15 January to 15 March is exactly two months regardless of the fact that those months contain 59 or 60 actual days. Tools that divide the day count by 30.44 give a smoothed figure that is convenient for statistics and wrong for anniversaries, deadlines and contract terms.',
    },
    {
      question: 'How do you handle the end of the month?',
      answer:
        'By clamping. One month after 31 January has no exact answer, because 31 February does not exist, so it resolves to 28 or 29 February depending on the year. Every mainstream date library does this, and it is why adding a month twice does not always give the same result as adding two months at once — 31 January plus one month plus one month is 28 March, while 31 January plus two months is 31 March.',
    },
    {
      question: 'What counts as a working day?',
      answer:
        'By default, Monday to Friday. Public holidays vary so much by country, region and even employer that no calculator can assume them, so this one lets you enter the ones that apply and subtracts any that fall on a weekday inside your range. Some contracts define business days differently again — banking days, court days, and clear days each have their own rules.',
    },
    {
      question: 'How many leap years are in a given range?',
      answer:
        'A year is a leap year if it is divisible by 4, except that century years are not leap years unless they are divisible by 400. So 1900 was not a leap year and 2000 was. That gives 97 leap years every 400 years, which makes the average Gregorian year 365.2425 days — about 27 seconds longer than the actual tropical year, an error of roughly one day every 3,200 years.',
    },
    {
      question: 'Why might two date calculators disagree by a day?',
      answer:
        'Almost always one of three things: the inclusive-versus-exclusive choice, a time zone difference that pushes one of the dates over midnight, or daylight saving. A span crossing a DST boundary is 23 or 25 hours long rather than 24, and a tool that divides elapsed milliseconds by 86,400,000 will round the wrong way. This calculator works in UTC on whole dates, so the clock never enters the arithmetic.',
    },
    {
      question: 'What is ISO 8601 week numbering?',
      answer:
        'A standard way of naming weeks in which every week starts on Monday and week 1 is the week containing the first Thursday of the year — equivalently, the week containing 4 January. It means a year has either 52 or 53 weeks, and the first days of January can belong to the last week of the previous year. Payroll, manufacturing and logistics systems use it heavily, and it differs from the US convention where weeks start on Sunday.',
    },
  ],
  sources: [
    {
      title: 'ISO 8601-1:2019 — Date and time representations for information interchange',
      publisher: 'International Organization for Standardization (ISO)',
      url: 'https://www.iso.org/standard/70907.html',
    },
    {
      title: 'Inter Gravissimas — the papal bull introducing the Gregorian calendar (1582)',
      publisher: 'United States Naval Observatory, Astronomical Applications Department',
      url: 'https://aa.usno.navy.mil/faq/calendars',
    },
    {
      title: 'UK bank holidays',
      publisher: 'UK Government (GOV.UK)',
      url: 'https://www.gov.uk/bank-holidays',
    },
  ],
  relatedSlugs: ['date-time/age-calculator'],
  publishedAt: '2026-08-09',
  updatedAt: '2026-08-09',
};

export default meta;
