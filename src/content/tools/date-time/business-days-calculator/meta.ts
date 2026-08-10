import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'business-days-calculator',
  category: 'date-time',
  name: 'Business Days Calculator',
  h1: 'Business Days Calculator',
  metaTitle: 'Business Days Calculator — Working Days Between Dates',
  metaDescription:
    'Count working days between two dates, or add business days to a date, excluding weekends and any public holidays you enter for your own jurisdiction.',
  shortDescription:
    'Count working days between two dates or add business days to one, with your own holiday list and a weekend that is not assumed to be Saturday and Sunday.',
  leadAnswer:
    'A business day is a day on which normal commercial operations run, conventionally Monday to Friday excluding public holidays. Contracts, delivery windows and payment terms are written in business days rather than calendar days, and the count differs by jurisdiction because every country and often every region keeps its own holiday calendar.',
  keywords: [
    'business days calculator',
    'working days between dates',
    'add business days to a date',
    'working day calculator',
    '10 business days from today',
    'weekdays between dates',
  ],
  faqs: [
    {
      question: 'Why does this calculator not know my public holidays?',
      answer:
        'Because there is no single answer to know. Public holidays differ by country, by region within a country, and by year — England and Scotland do not share a full list, US federal holidays are not binding on private employers, and dates such as Easter move annually. A tool that shipped one built-in list would be quietly wrong for most visitors, and a wrong holiday list is worse than none because it looks authoritative. Paste the dates that apply to you and the count is exact for your situation.',
    },
    {
      question: 'Does "10 business days" include the day I start counting from?',
      answer:
        'Usually not. The common convention, and the one used by most courts and contracts, is that the count starts on the next business day after the triggering event — so a notice served on Monday with a ten business day deadline runs from Tuesday. Conventions do vary, though, which is why this calculator makes it a visible option rather than a hidden assumption. When money or a legal deadline depends on it, read the clause rather than trusting any calculator, including this one.',
    },
    {
      question: 'Is the weekend always Saturday and Sunday?',
      answer:
        'No. It is Friday and Saturday across much of the Middle East, and several countries have moved in recent years — the United Arab Emirates shifted to a Saturday and Sunday weekend for the public sector in 2022, while others kept the older pattern. Some sectors run a six-day week with only Sunday off. The weekend is configurable here for that reason, because assuming Saturday and Sunday silently breaks the count for a large part of the world.',
    },
    {
      question: 'What is the difference between a business day and a working day?',
      answer:
        'In most usage, nothing — the terms are interchangeable and both mean a weekday that is not a public holiday. Where a difference appears it is usually contractual: a contract may define "working day" narrowly, for example as a day when banks are open for business in a named city, which excludes local holidays that are not national ones. If a document defines the term, that definition governs, whatever a calculator says.',
    },
    {
      question: 'Do business days include half days and company shutdowns?',
      answer:
        'Not automatically. Christmas Eve half days, the week between Christmas and New Year, and company-wide shutdowns are employer policy rather than public holidays, so they do not appear on any national list. If they affect your deadline, add them to the holiday box as full days — the arithmetic cannot distinguish a half day, so treating one as either working or non-working is a judgement you have to make explicitly.',
    },
    {
      question: 'How do banking days differ from business days?',
      answer:
        'Banking days are the days a payment system settles, which is narrower. A payment initiated on a Friday afternoon may not settle until Monday or later, and cross-border payments depend on both countries having a banking day in common. Faster payment schemes have eroded this in some markets but not eliminated it. When a term is written in banking days rather than business days, the settlement calendar governs and it is not the same as the public holiday calendar.',
    },
    {
      question: 'Why does my answer differ from another calculator by one day?',
      answer:
        'Almost always because of endpoint handling. Counting the days between two dates can include both endpoints, neither, or only one, and each convention is defensible. Between Monday and Friday of the same week there are five weekdays inclusive, four days of difference exclusive of the start, and three clear days between them. All three are correct answers to slightly different questions, so check which one your source is asking before assuming a tool is broken.',
    },
  ],
  sources: [
    {
      title: 'UK bank holidays — England and Wales, Scotland, Northern Ireland',
      publisher: 'UK Government (GOV.UK)',
      url: 'https://www.gov.uk/bank-holidays',
    },
    {
      title: 'Federal Holidays — pay and leave policy',
      publisher: 'United States Office of Personnel Management (OPM)',
      url: 'https://www.opm.gov/policy-data-oversight/pay-leave/federal-holidays/',
    },
  ],
  relatedSlugs: ['date-time/date-difference-calculator', 'date-time/work-hours-calculator'],
  publishedAt: '2026-08-10',
  updatedAt: '2026-08-10',
};

export default meta;
