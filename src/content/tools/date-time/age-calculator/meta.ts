import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'age-calculator',
  category: 'date-time',
  name: 'Age Calculator',
  h1: 'Age Calculator',
  metaTitle: 'Age Calculator — Exact Years, Months and Days',
  metaDescription:
    'Work out an exact age in years, months and days from a date of birth, with total days lived, the weekday you were born on, and days until your next birthday.',
  shortDescription:
    'Find an exact age in years, months and days, with leap years and month lengths handled properly rather than averaged away.',
  keywords: [
    'age calculator',
    'how old am i',
    'date of birth calculator',
    'age in days',
    'days until birthday',
    'exact age',
  ],
  faqs: [
    {
      question: 'How is age calculated in years, months and days?',
      answer:
        'By counting calendar units rather than dividing total days. The calculator finds the largest whole number of months from your date of birth that still lands on or before the target date, adds them to your birth date — clamping the day to the last one that exists if the target month is shorter — and measures the leftover in real days from there. Anchoring on that clamped anniversary is what stops month-end dates producing a negative day count.',
    },
    {
      question: 'Why does my age in months not match my age in days divided by 30?',
      answer:
        'Because no month is 30 days long except four of them. Months run from 28 to 31 days, so a fixed 30-day divisor drifts by up to three days per month and roughly five days per year. This calculator counts real calendar months, so the answer matches what a person would say rather than what an average produces.',
    },
    {
      question: 'How are leap years handled?',
      answer:
        'They are counted as they actually fall. A year is a leap year if it is divisible by 4, except century years, which must be divisible by 400 — so 2000 was a leap year and 1900 was not. Because the calculator works from real calendar dates rather than an assumed 365.25-day year, leap days are included automatically wherever they occur in the span.',
    },
    {
      question: 'What happens if I was born on 29 February?',
      answer:
        'This calculator applies the same clamping rule it uses everywhere else, so a 29 February birthday falls on 28 February in common years — you turn a year older on the last day of February. Using one rule throughout is what keeps the age and the next-birthday countdown consistent with each other. It is a convention rather than a universal rule: some jurisdictions treat the legal birthday as 1 March instead, which matters for the exact day someone reaches the age of majority.',
    },
    {
      question: 'Does this account for time zones?',
      answer:
        'It works in whole calendar dates and ignores clock time, which is what age normally means. All arithmetic runs in UTC so that a daylight saving change cannot silently add or remove an hour and shift a boundary date. If you were born late in the evening in one time zone and want your age reckoned in another, the calendar date of birth is the thing to adjust.',
    },
    {
      question: 'Can I calculate age at a past or future date?',
      answer:
        'Yes. The "age on" field defaults to today but accepts any date, so you can work out how old someone was at a particular event, or how old they will be on a future date. The date of birth must be on or before it — the calculator rejects the reverse rather than reporting a negative age.',
    },
    {
      question: 'Why does the weekday I was born on matter?',
      answer:
        'It usually does not, but it is the single most requested extra on a tool like this. It is computed from the actual calendar rather than a mnemonic, so it is correct for any date in the Gregorian calendar, including dates before you were likely to have been born.',
    },
  ],
  sources: [
    {
      title: 'Introduction to Calendars — leap year rules and the Gregorian reform',
      publisher: 'United States Naval Observatory, Astronomical Applications Department',
      url: 'https://aa.usno.navy.mil/faq/calendars',
    },
    {
      title: 'ISO 8601 — Date and time format',
      publisher: 'International Organization for Standardization (ISO)',
      url: 'https://www.iso.org/iso-8601-date-and-time-format.html',
    },
    {
      title: 'Julian Date Converter',
      publisher: 'United States Naval Observatory, Astronomical Applications Department',
      url: 'https://aa.usno.navy.mil/data/JulianDate',
    },
  ],
  relatedSlugs: ['health/bmi-calculator'],
  publishedAt: '2026-08-07',
  updatedAt: '2026-08-07',
};

export default meta;
