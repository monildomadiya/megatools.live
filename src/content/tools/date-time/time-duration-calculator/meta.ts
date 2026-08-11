import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'time-duration-calculator',
  category: 'date-time',
  name: 'Time Duration Calculator',
  h1: 'Time Duration Calculator',
  metaTitle: 'Time Duration Calculator — Hours Between Times',
  metaDescription:
    'Work out the hours and minutes between two times, with breaks deducted and the decimal-hours figure payroll needs shown alongside the hours-and-minutes one.',
  shortDescription:
    'Find the hours and minutes between two times, with breaks deducted and the decimal figure payroll actually wants shown too.',
  leadAnswer:
    'The gap between two clock times is found by converting both to minutes since midnight and subtracting. An end time earlier than the start means the period crossed midnight, so a day is added. The result matters in two incompatible formats: hours and minutes for people, decimal hours for payroll.',
  keywords: [
    'time duration calculator',
    'hours between two times',
    'time card calculator',
    'work hours calculator',
    'decimal hours converter',
    'time difference calculator',
  ],
  faqs: [
    {
      question: 'How many hours is 9:15am to 5:45pm?',
      answer:
        'Eight hours and thirty minutes, or 8.5 decimal hours. If a thirty minute unpaid break is deducted it becomes eight hours flat. The two figures are the same duration written for two different readers — a person reads 8h 30m, a payroll system wants 8.5 — and mixing them up is the most common timesheet error there is.',
    },
    {
      question: 'Why is 8 hours 30 minutes written as 8.5 and not 8.30?',
      answer:
        'Because the decimal is a fraction of an hour, not the minute count with a point in front of it. Thirty minutes is half an hour, so 8.5. Writing 8.30 on a timesheet claims eight hours and eighteen minutes, since 0.30 of an hour is 18 minutes. The error is small per entry and consistent in the employer’s favour, which is why it is worth catching.',
    },
    {
      question: 'How do I convert minutes to decimal hours?',
      answer:
        'Divide by 60. Fifteen minutes is 0.25, twenty minutes is 0.333, forty-five minutes is 0.75. Only the quarter hours land on tidy decimals, which is why timesheets so often round to the nearest quarter — and why some minute values recur forever and have to be rounded somewhere.',
    },
    {
      question: 'What happens if the shift crosses midnight?',
      answer:
        'The tool detects it automatically. When the end time is earlier than the start — 22:00 to 06:00, for instance — it treats the end as being on the following day and adds twenty-four hours, giving eight hours rather than a negative number. The one case it cannot resolve for you is a shift longer than twenty-four hours, which has to be entered as separate days.',
    },
    {
      question: 'Is rounding my hours to the nearest quarter legal?',
      answer:
        'In the United States, yes, within limits. Federal regulations permit rounding to the nearest quarter hour provided it does not consistently work against the employee — rounding must go both ways over time, not always down. Rounding that systematically shortens paid time has been found unlawful. Rules differ elsewhere and some jurisdictions require actual minutes worked, so check locally rather than assuming.',
    },
    {
      question: 'Does daylight saving affect the result?',
      answer:
        'This tool works on clock times within a single day and does not apply a timezone, so it never adjusts for daylight saving. That is correct for a timesheet, where you record the clock times as they appeared. It is not correct for the two nights a year when the clocks change and a shift is genuinely an hour longer or shorter than the clock suggests — on those nights, adjust the total by hand.',
    },
    {
      question: 'How do I add up a whole week of shifts?',
      answer:
        'Convert each day to decimal hours first, then add. Adding hours and minutes directly means carrying at sixty rather than a hundred, which is exactly where mental arithmetic slips — 7h 45m plus 6h 30m is 14h 15m, not 13h 75m. In decimal it is 7.75 plus 6.5 = 14.25, which is a sum any calculator or spreadsheet handles without a special case.',
    },
  ],
  sources: [
    {
      title: 'ISO 8601 — Date and time format, including duration representation',
      publisher: 'International Organization for Standardization (ISO)',
      url: 'https://www.iso.org/iso-8601-date-and-time-format.html',
    },
    {
      title: '29 CFR 785.48 — Use of time clocks and the rounding of hours worked',
      publisher: 'US Department of Labor / Code of Federal Regulations',
      url: 'https://www.ecfr.gov/current/title-29/subtitle-B/chapter-V/subchapter-B/part-785/subpart-D/section-785.48',
    },
    {
      title: 'Fact Sheet #22 — Hours Worked Under the Fair Labor Standards Act',
      publisher: 'US Department of Labor, Wage and Hour Division',
      url: 'https://www.dol.gov/agencies/whd/fact-sheets/22-flsa-hours-worked',
    },
  ],
  relatedSlugs: ['date-time/work-hours-calculator', 'conversion/time-converter'],
  publishedAt: '2026-08-11',
  updatedAt: '2026-08-11',
};

export default meta;
