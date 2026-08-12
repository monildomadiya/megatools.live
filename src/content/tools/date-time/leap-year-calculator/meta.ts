import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'leap-year-calculator',
  category: 'date-time',
  name: 'Leap Year Calculator',
  h1: 'Leap Year Calculator',
  metaTitle: 'Leap Year Calculator — Check Any Year, Any Range',
  metaDescription:
    'Check whether a year is a leap year and see which rule decided it, count the leap years in a range, and find the weekday of any 29 February.',
  shortDescription:
    'Check any year against the full Gregorian rule, and count the leap years between two dates.',
  leadAnswer:
    'A Gregorian leap year is one divisible by 4, except years divisible by 100, unless they are also divisible by 400. That is why 1900 was a common year and 2000 was a leap year. The extra day keeps the calendar aligned with the solar year, which is about 365.2422 days long.',
  keywords: [
    'leap year calculator',
    'is it a leap year',
    'leap year rule',
    'february 29 calculator',
    'leap years between dates',
    'next leap year',
  ],
  faqs: [
    {
      question: 'What is the full leap year rule?',
      answer:
        'A year is a leap year if it is divisible by 4, unless it is divisible by 100, in which case it is not — unless it is also divisible by 400, in which case it is. 1996 and 2024 are leap years by the first clause, 1900 was excluded by the second, and 2000 was restored by the third. The next exception is 2100, which will not be a leap year.',
    },
    {
      question: 'Why is a correction needed at all?',
      answer:
        'Because the solar year is not a whole number of days. It runs about 365.2422 days, so a fixed 365-day calendar drifts by nearly a quarter of a day annually. Adding a day every fourth year over-corrects slightly, at 365.25 days per year, and the century rules remove that surplus. What remains drifts by roughly one day in 3,000 years.',
    },
    {
      question: 'What was wrong with the Julian calendar?',
      answer:
        'It applied the four-year rule with no exceptions, making the average year 365.25 days — about 11 minutes too long. That is small annually and large over centuries: by the 1500s the calendar had slipped ten days against the seasons, moving the equinox and with it the calculation of Easter. The Gregorian reform of 1582 dropped those ten days and added the century rules to stop the drift recurring.',
    },
    {
      question: 'Do different countries have different leap years?',
      answer:
        'Not now, but the changeover was staggered by centuries. Catholic Europe adopted the Gregorian calendar in 1582; Britain and its colonies waited until 1752, when the day after 2 September was 14 September; Russia changed in 1918 and Greece in 1923. Dates in that gap are ambiguous unless the source says which calendar it used, which is why historical records are sometimes marked Old Style or New Style.',
    },
    {
      question: 'Are leap seconds the same thing?',
      answer:
        'No, and they are unrelated in mechanism. A leap year corrects the calendar against the Earth’s orbit; a leap second corrects clocks against the Earth’s rotation, which is irregular and slowing unevenly. Leap seconds are announced by the IERS a few months ahead rather than following a rule, and a decision has been taken to stop inserting them by 2035.',
    },
    {
      question: 'When do people born on 29 February have a birthday?',
      answer:
        'Legally it depends on the jurisdiction, and the two common answers are 28 February and 1 March. In common-law countries a person is generally treated as attaining an age at the start of the anniversary day, which places it on 1 March in a non-leap year; some statutes specify 28 February instead. Socially most people simply pick one. The date returns every four years, with the century exceptions applying as usual.',
    },
    {
      question: 'Why do spreadsheets think 1900 was a leap year?',
      answer:
        'Because Excel’s serial date system deliberately includes a 29 February 1900 that never existed, for compatibility with Lotus 1-2-3, which had the bug first. Microsoft documents it as intentional: fixing it would shift every date before 1 March 1900 in every existing file. The consequence is that date arithmetic spanning that boundary is off by one day, which almost never matters and occasionally does.',
    },
  ],
  sources: [
    {
      title: 'Introduction to Calendars — the Gregorian calendar and its leap year rules',
      publisher: 'US Naval Observatory, Astronomical Applications Department',
      url: 'https://aa.usno.navy.mil/faq/calendars',
    },
    {
      title: 'Calendar (New Style) Act 1750 — Britain’s adoption of the Gregorian calendar',
      publisher: 'UK Government (legislation.gov.uk)',
      url: 'https://www.legislation.gov.uk/apgb/Geo2/24/23/contents',
    },
    {
      title: 'Excel incorrectly assumes that the year 1900 is a leap year',
      publisher: 'Microsoft Learn',
      url: 'https://learn.microsoft.com/en-us/office/troubleshoot/excel/wrongly-assumes-1900-is-leap-year',
    },
    {
      title: 'Earth orientation, UT1 and the announcement of leap seconds',
      publisher: 'International Earth Rotation and Reference Systems Service (IERS)',
      url: 'https://www.iers.org/IERS/EN/Home/home_node.html',
    },
  ],
  relatedSlugs: ['date-time/age-calculator', 'date-time/week-number-calculator'],
  publishedAt: '2026-08-12',
  updatedAt: '2026-08-12',
};

export default meta;
