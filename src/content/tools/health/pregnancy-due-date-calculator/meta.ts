import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'pregnancy-due-date-calculator',
  category: 'health',
  name: 'Due Date Calculator',
  h1: 'Pregnancy Due Date Calculator',
  metaTitle: 'Due Date Calculator — From LMP, Conception or IVF',
  metaDescription:
    'Estimate a due date from a last period, a known conception date or an IVF transfer, with current gestational age — and how wide the real spread of birth dates is.',
  shortDescription:
    'Estimate a due date from a last period, conception date or IVF transfer, with gestational age and an honest range rather than one date.',
  leadAnswer:
    'An estimated due date is conventionally 280 days from the first day of the last menstrual period, a convention known as Naegele’s rule. It assumes a 28-day cycle with ovulation on day 14, which is why a first-trimester ultrasound is the more accurate method and overrides it in clinical practice.',
  keywords: [
    'due date calculator',
    'pregnancy due date calculator',
    'how many weeks pregnant',
    'gestational age calculator',
    'ivf due date calculator',
    'conception date calculator',
  ],
  faqs: [
    {
      question: 'How accurate is a due date?',
      answer:
        'As a single date, not very. Only about 4 percent of babies arrive on the estimated due date itself, and roughly two thirds arrive within a week either side of it. A study of naturally conceived pregnancies with precisely dated ovulation found the length of gestation varying by as much as five weeks between individuals. The date is the centre of a distribution, not a prediction.',
    },
    {
      question: 'Why is pregnancy dated from my last period rather than conception?',
      answer:
        'Because the last period is a date most people know and conception usually is not. The convention adds roughly two weeks that you were not pregnant for — which is why you are considered four weeks pregnant about two weeks after conception, and why the 40 weeks of a pregnancy contains about 38 weeks of actual gestation.',
    },
    {
      question: 'What if my cycle is not 28 days?',
      answer:
        'Then Naegele’s rule is off, and the tool adjusts for it. The rule assumes ovulation on day 14; a 35-day cycle usually means ovulation around day 21, so the due date shifts about a week later. Enter your usual cycle length and the estimate corrects for the difference. Very irregular cycles make last-period dating unreliable altogether, which is one of the situations where an early scan matters most.',
    },
    {
      question: 'Which is more accurate, my dates or the scan?',
      answer:
        'The scan, and clinical guidance is explicit about it. ACOG identifies first-trimester ultrasound measurement of crown-rump length as the most accurate method of establishing gestational age, and recommends the ultrasound date replace the period-based one when the two differ by more than a defined margin. That margin is small early on — around five to seven days in the first trimester — and widens later, because ultrasound dating itself becomes less precise as pregnancy progresses.',
    },
    {
      question: 'How is an IVF due date different?',
      answer:
        'It is more precise, because the date of fertilisation is known rather than inferred. The due date is counted from the transfer, adjusted for how many days the embryo had already developed: 266 days from a day-3 transfer minus 3, and minus 5 for a day-5 blastocyst. There is no cycle length to estimate and no ovulation to guess at, which removes the largest source of uncertainty in the usual method.',
    },
    {
      question: 'What does full term actually mean?',
      answer:
        'The terminology was tightened in 2013 because "term" was being used for a five-week span as if it were uniform. Early term is 37 weeks 0 days to 38 weeks 6 days, full term is 39 weeks 0 days to 40 weeks 6 days, late term is 41 weeks, and post-term is 42 weeks and beyond. The distinction exists because outcomes at 37 weeks are measurably different from those at 39, which matters when a delivery is being scheduled.',
    },
    {
      question: 'Can this tool tell me my conception date?',
      answer:
        'It estimates one, and the estimate carries the same uncertainty as everything else here. Working backwards assumes ovulation happened mid-cycle, which is an average rather than a fact about any individual. Sperm can remain viable for around five days, so intercourse and fertilisation are not the same date either. Treat a calculated conception date as approximate, and be careful about using it to draw conclusions that depend on precision.',
    },
  ],
  sources: [
    {
      title: 'Committee Opinion No. 700: Methods for Estimating the Due Date',
      publisher: 'American College of Obstetricians and Gynecologists (ACOG)',
      url: 'https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2017/05/methods-for-estimating-the-due-date',
    },
    {
      title: 'NG201 — Antenatal care: NICE guideline',
      publisher: 'National Institute for Health and Care Excellence (NICE)',
      url: 'https://www.nice.org.uk/guidance/ng201',
    },
    {
      title: 'Length of human pregnancy and contributors to its natural variation (2013)',
      publisher: 'Jukic et al., Human Reproduction',
      url: 'https://doi.org/10.1093/humrep/det297',
    },
  ],
  relatedSlugs: ['date-time/date-calculator', 'date-time/date-difference-calculator'],
  publishedAt: '2026-08-11',
  updatedAt: '2026-08-11',
};

export default meta;
