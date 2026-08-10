import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'time-converter',
  category: 'conversion',
  name: 'Time Converter',
  h1: 'Time Unit Converter',
  metaTitle: 'Time Converter — Seconds, Minutes, Hours, Days, Years',
  metaDescription:
    'Convert seconds, minutes, hours, days, weeks, months and years, with the averaging convention used for months and years stated on the page rather than hidden.',
  shortDescription:
    'Convert between nanoseconds and centuries, with the averaging convention behind months and years stated rather than quietly assumed.',
  leadAnswer:
    'A second is the SI base unit of time, defined since 1967 by 9,192,631,770 periods of a specific transition in the caesium-133 atom. Minutes, hours and days are exact multiples of it. Months and years are not: they vary in length, so converting them requires an averaging convention, which this page states explicitly.',
  keywords: [
    'time converter',
    'seconds to minutes',
    'hours to days',
    'minutes to hours',
    'days to years',
    'seconds in a day',
    'weeks to months',
    'milliseconds to seconds',
  ],
  faqs: [
    {
      question: 'How many seconds are in a day?',
      answer:
        'Exactly 86,400 by definition: 24 hours of 60 minutes of 60 seconds. That is the number this converter uses and the number almost every piece of software uses. It is not always the length of an actual calendar day, though. A UTC day containing a leap second runs to 86,401 seconds, and a civil day at the start or end of daylight saving time runs to 23 or 25 hours in local time while remaining 24 hours in UTC.',
    },
    {
      question: 'Why does a month not have a fixed length?',
      answer:
        'Because calendar months are 28, 29, 30 or 31 days, and no single number is correct for all of them. Any converter that offers months has to pick a convention. This one uses the mean Gregorian month: the 400-year Gregorian cycle contains exactly 146,097 days, which divided by 4,800 months gives 30.436875 days, or 2,629,746 seconds. That average is the right choice for long spans and the wrong choice for a specific month, where you should count the actual days instead.',
    },
    {
      question: 'What is the difference between a Julian year and a Gregorian year?',
      answer:
        'A Julian year is exactly 365.25 days, or 31,557,600 seconds. The mean Gregorian year is 365.2425 days, or 31,556,952 seconds — 648 seconds shorter, because the Gregorian calendar drops three leap days every 400 years. Astronomy standardised on the Julian year, which is what the light-year is built from. Civil timekeeping follows the Gregorian calendar. Both are offered here because both are in real use and they disagree by about eleven minutes a year.',
    },
    {
      question: 'What is a leap second, and does it affect these conversions?',
      answer:
        'A leap second is an extra second inserted into UTC to keep atomic time within 0.9 seconds of the Earth’s rotation, which is gradually and irregularly slowing. Twenty-seven have been added since 1972, the most recent at the end of 2016. They do not affect unit conversion — a second is a second — but they do mean the number of elapsed seconds between two calendar dates is not always the number this converter would predict. In 2022 the General Conference on Weights and Measures resolved to stop using leap seconds by 2035.',
    },
    {
      question: 'How many weeks are in a year?',
      answer:
        'A common year of 365 days is 52 weeks and 1 day; a leap year is 52 weeks and 2 days. Averaged over the Gregorian cycle a year is 52.1775 weeks. This is why a fixed date advances by one weekday each year and by two across a leap year, and why annual events pinned to a weekday — the second Tuesday, the last Friday — drift against the date rather than the other way round.',
    },
    {
      question: 'Why do computers count time in seconds since 1970?',
      answer:
        'Unix time counts seconds elapsed since 00:00:00 UTC on 1 January 1970, a convention that spread from Unix into nearly every operating system, database and programming language. It deliberately ignores leap seconds, treating every day as exactly 86,400 seconds, which keeps arithmetic simple at the cost of drifting from true elapsed time by the 27 seconds accumulated so far. Signed 32-bit counters overflow on 19 January 2038, which is why 64-bit time is now standard.',
    },
    {
      question: 'Is a business day the same as a day?',
      answer:
        'No. A business day is a working day excluding weekends and public holidays, and its length depends on a jurisdiction and a calendar rather than on arithmetic. Contracts, delivery windows and payment terms are usually written in business days, so converting "10 business days" to two weeks is wrong the moment a holiday falls inside the window. Unit conversion cannot answer that question; a calendar can.',
    },
  ],
  sources: [
    {
      title: 'The International System of Units (SI), 9th edition — definition of the second',
      publisher: 'Bureau International des Poids et Mesures (BIPM)',
      url: 'https://www.bipm.org/en/publications/si-brochure',
    },
    {
      title: 'Time and Frequency Division — time realization and dissemination',
      publisher: 'National Institute of Standards and Technology (NIST)',
      url: 'https://www.nist.gov/pml/time-and-frequency-division',
    },
    {
      title: 'Earth orientation parameters and leap second announcements',
      publisher: 'International Earth Rotation and Reference Systems Service (IERS)',
      url: 'https://www.iers.org',
    },
  ],
  relatedSlugs: [
    'date-time/date-difference-calculator',
    'developer/unix-timestamp-converter',
    'date-time/work-hours-calculator',
  ],
  publishedAt: '2026-08-10',
  updatedAt: '2026-08-10',
};

export default meta;
