import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'work-hours-calculator',
  category: 'date-time',
  name: 'Work Hours Calculator',
  h1: 'Work Hours Calculator',
  metaTitle: 'Work Hours Calculator — Weekly Timesheet and Pay',
  metaDescription:
    'Add up a week of shifts, subtract unpaid breaks, and see total hours in decimal and hours-and-minutes, with overtime split out and gross pay at your hourly rate.',
  shortDescription:
    'Total a week of shifts with unpaid breaks deducted, split regular from overtime hours, and price it at your hourly rate.',
  leadAnswer:
    'Hours worked on a shift are the end time minus the start time, less any unpaid break, converted to decimal hours for payroll. A shift from 09:00 to 17:30 with a 30-minute unpaid lunch is 8 hours exactly, written as 8.00 on a timesheet rather than 8.30.',
  keywords: [
    'work hours calculator',
    'timesheet calculator',
    'hours worked calculator',
    'time card calculator',
    'weekly hours calculator',
    'overtime calculator',
  ],
  faqs: [
    {
      question: 'How do I convert hours and minutes to decimal hours?',
      answer:
        'Divide the minutes by 60 and add the result to the hours. Forty-five minutes is 45 ÷ 60 = 0.75, so 7 hours 45 minutes is 7.75 hours. Writing it as 7.45 is the most common payroll error there is, and it underpays by 18 minutes a shift.',
    },
    {
      question: 'How do I calculate hours for an overnight shift?',
      answer:
        'If the finish time is earlier on the clock than the start time, the shift crossed midnight, so add 24 hours to the finish before subtracting. A shift from 22:00 to 06:30 is 06:30 plus a day, minus 22:00, which is 8 hours 30 minutes. This calculator does that automatically whenever the end time is at or before the start.',
    },
    {
      question: 'Are unpaid breaks deducted from hours worked?',
      answer:
        'Bona fide meal periods, generally 30 minutes or longer with the employee relieved of duty, are not counted as hours worked under US federal rules. Short rest breaks of about 5 to 20 minutes are counted and must be paid. A lunch break where you have to stay at your desk to answer the phone is working time, not a break.',
    },
    {
      question: 'When does overtime start?',
      answer:
        'Under the US Fair Labor Standards Act, non-exempt employees must be paid at least one and a half times their regular rate for hours over 40 in a workweek. There is no federal daily overtime rule; some states add one, notably California over 8 hours in a day. Many other countries handle long hours through a weekly limit and rest rules instead of a premium rate.',
    },
    {
      question: 'Can an employer round my clock-in times?',
      answer:
        'US federal regulations permit rounding to the nearest quarter hour, but only if the practice is neutral over time — it must round up as often as it rounds down. A system that always rounds start times up and finish times down systematically shortens paid hours and is not lawful.',
    },
    {
      question: 'What is the maximum I can be asked to work in a week?',
      answer:
        'In the EU and the UK, average weekly working time including overtime is capped at 48 hours over a reference period, normally 17 weeks, under the Working Time Directive. Workers in the UK can opt out of the 48-hour limit in writing; the daily and weekly rest entitlements cannot be opted out of. US federal law sets no maximum for adults.',
    },
    {
      question: 'Does travel between jobs count as hours worked?',
      answer:
        'Travel from site to site during the working day counts. An ordinary home-to-work commute does not. Waiting time counts when you are engaged to wait rather than free to use the time for yourself. These distinctions are set out in the US hours-worked regulations at 29 CFR Part 785.',
    },
    {
      question: 'How many working hours are in a month?',
      answer:
        'There is no fixed number, which is why salaried monthly pay is usually an annual figure divided by twelve rather than hours multiplied by a rate. A 40-hour week over a 52-week year is 2,080 hours, or 173.33 hours a month on average — but individual months range from about 160 to 184 hours depending on how the weekdays fall.',
    },
  ],
  sources: [
    {
      title: 'Overtime Pay under the Fair Labor Standards Act',
      publisher: 'US Department of Labor, Wage and Hour Division',
      url: 'https://www.dol.gov/agencies/whd/overtime',
    },
    {
      title: '29 CFR Part 785 — Hours Worked',
      publisher: 'US Department of Labor (eCFR)',
      url: 'https://www.ecfr.gov/current/title-29/part-785',
    },
    {
      title:
        'Directive 2003/88/EC concerning certain aspects of the organisation of working time',
      publisher: 'EUR-Lex, European Union',
      url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex%3A32003L0088',
    },
    {
      title: 'Maximum weekly working hours',
      publisher: 'UK Government (GOV.UK)',
      url: 'https://www.gov.uk/maximum-weekly-working-hours',
    },
  ],
  relatedSlugs: ['finance/salary-calculator', 'date-time/date-difference-calculator'],
  publishedAt: '2026-08-10',
  updatedAt: '2026-08-10',
};

export default meta;
