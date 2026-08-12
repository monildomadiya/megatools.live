import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'heart-rate-zone-calculator',
  category: 'health',
  name: 'Heart Rate Zone Calculator',
  h1: 'Heart Rate Zone Calculator',
  metaTitle: 'Heart Rate Zone Calculator — Training Zones',
  metaDescription:
    'Work out your five training heart rate zones from age or a measured maximum, by percentage of max or heart rate reserve — with how wrong 220 minus age is.',
  shortDescription:
    'Get your five training zones in beats per minute, by percentage of maximum or by heart rate reserve.',
  leadAnswer:
    'Heart rate zones divide the range between rest and maximum into bands, each corresponding to a different training effect. They are usually set as percentages of maximum heart rate, or of heart rate reserve — the gap between resting and maximum — which accounts for how fit the individual already is.',
  keywords: [
    'heart rate zone calculator',
    'target heart rate calculator',
    'max heart rate calculator',
    'karvonen formula calculator',
    'heart rate reserve',
    'training zones',
  ],
  faqs: [
    {
      question: 'Is 220 minus age wrong?',
      answer:
        'It is imprecise rather than wrong, and it was never derived from research. It appeared in the 1970s as a rough fit to scattered data and has been repeated ever since. A 2001 meta-analysis of the published literature by Tanaka and colleagues proposed 208 − 0.7 × age instead, which tracks the data better across the age range. Both carry a standard deviation of roughly 10 beats per minute between individuals.',
    },
    {
      question: 'How far out can an age-predicted maximum be?',
      answer:
        'Around 10 to 12 beats per minute either side is typical, and larger errors happen. For a 40-year-old, a predicted maximum of 180 could plausibly belong to someone whose real maximum is 165 or 195. That range is wider than the zones themselves, which is why a measured maximum beats any formula and why zones are guides rather than thresholds.',
    },
    {
      question: 'What is the difference between percentage of max and the Karvonen method?',
      answer:
        'Percentage of maximum takes a share of the top number alone. The Karvonen method, published in 1957, works from heart rate reserve: the difference between resting and maximum heart rate, with the resting rate added back afterwards. Karvonen zones sit higher in beats per minute for the same percentage label, and they respond to fitness, because a resting heart rate falls as conditioning improves.',
    },
    {
      question: 'How do I measure my resting heart rate properly?',
      answer:
        'Take it before getting out of bed, on several consecutive mornings, and average them. Anything measured after caffeine, food, activity or stress is not a resting rate. Values between 60 and 80 are common in untrained adults and the 40s are normal in endurance athletes. A resting rate that drifts up by five or more beats over a few days often means fatigue, illness or poor sleep rather than lost fitness.',
    },
    {
      question: 'Should I train by heart rate at all?',
      answer:
        'It is a useful signal with known lags and distortions. Heart rate takes a minute or two to respond to a change in effort, so it is poor for short intervals; it drifts upward at constant effort as a session goes on, and it rises in heat, at altitude, when dehydrated and when under-recovered. For steady aerobic work it is excellent. For sprints, power or pace is the better measure.',
    },
    {
      question: 'What are the zones actually for?',
      answer:
        'Broadly: zones 1 and 2 build aerobic base and are where most training volume belongs; zone 3 is the moderately hard middle that feels productive and accumulates fatigue faster than it adds fitness; zones 4 and 5 develop threshold and maximal capacity in short doses. Most endurance programmes put around 80% of time low and the remainder high, with little in the middle.',
    },
    {
      question: 'Do medications affect this?',
      answer:
        'Yes, and beta blockers in particular. They lower both resting and maximum heart rate substantially, which makes every age-predicted figure and every zone derived from it meaningless. Anyone taking rate-limiting medication, or with a pacemaker or a diagnosed arrhythmia, should get zones set by the clinician managing their care rather than by any calculator.',
    },
  ],
  sources: [
    {
      title: 'Age-predicted maximal heart rate revisited — Tanaka, Monahan & Seals, Journal of the American College of Cardiology (2001)',
      publisher: 'US National Library of Medicine (PubMed)',
      url: 'https://pubmed.ncbi.nlm.nih.gov/11153730/',
    },
    {
      title: 'Target Heart Rates Chart',
      publisher: 'American Heart Association',
      url: 'https://www.heart.org/en/healthy-living/fitness/fitness-basics/target-heart-rates',
    },
    {
      title: 'Physical Activity Guidelines for Americans, 2nd edition',
      publisher: 'US Department of Health and Human Services',
      url: 'https://health.gov/our-work/nutrition-physical-activity/physical-activity-guidelines',
    },
  ],
  relatedSlugs: ['health/tdee-calculator', 'health/bmr-calculator'],
  publishedAt: '2026-08-12',
  updatedAt: '2026-08-12',
};

export default meta;
