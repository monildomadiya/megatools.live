import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'body-fat-calculator',
  category: 'health',
  name: 'Body Fat Calculator',
  h1: 'Body Fat Percentage Calculator',
  metaTitle: 'Body Fat Calculator — US Navy Tape Method',
  metaDescription:
    'Estimate body fat percentage with the US Navy circumference method, cross-check it against the BMI-based Deurenberg formula, and see your fat and lean mass.',
  shortDescription:
    'Estimate body fat from a tape measure using the US Navy method, and see how far the BMI-based estimate disagrees.',
  keywords: [
    'body fat calculator',
    'body fat percentage',
    'us navy body fat',
    'navy body fat calculator',
    'lean body mass calculator',
    'body fat percentage chart',
  ],
  faqs: [
    {
      question: 'How accurate is the US Navy body fat formula?',
      answer:
        'Hodgdon and Beckett reported a standard error of estimate of roughly 4 percentage points against hydrostatic weighing, with correlations around 0.87 to 0.90. That means a reading of 20 percent is realistically somewhere between about 16 and 24. It is accurate enough to track a direction over months and not accurate enough to argue about a single point.',
    },
    {
      question: 'Where exactly do I measure my waist and neck?',
      answer:
        'The Navy protocol measures the neck just below the larynx, with the tape sloping slightly downward at the front. For men the waist is measured at the navel; for women it is measured at the narrowest point of the torso, and the hips at the widest point of the buttocks. Measure against bare skin, keep the tape snug without compressing, and take the reading at the end of a normal exhale.',
    },
    {
      question: 'Why does the women’s formula need a hip measurement?',
      answer:
        'The men’s equation infers fat from how much wider the waist is than the neck. That signal is much weaker in women, who store proportionally more fat around the hips and thighs than around the abdomen. Adding hip circumference gives the equation something to read that abdominal girth alone would miss.',
    },
    {
      question: 'Why do the two estimates on this page disagree?',
      answer:
        'They are measuring different things. The Navy method reads the actual shape of your body from a tape. The Deurenberg formula only knows your BMI, age and sex, so two people of identical height and weight get identical answers no matter how differently that weight is distributed. When the two diverge sharply, it usually means your build is unusual for your BMI — often more muscle than average, sometimes more central fat.',
    },
    {
      question: 'What is a healthy body fat percentage?',
      answer:
        'The American Council on Exercise puts the fitness range at 14 to 17 percent for men and 21 to 24 percent for women, with 18 to 24 and 25 to 31 respectively described as acceptable. Below those sit athlete and essential-fat ranges; above 25 percent for men and 32 percent for women is classed as obese. Essential fat — 2 to 5 percent for men, 10 to 13 percent for women — is the floor required for normal physiology, not a target.',
    },
    {
      question: 'Why is the healthy range higher for women?',
      answer:
        'Women carry more essential fat than men — roughly 10 to 13 percent against 2 to 5 — because of sex-specific fat in the breasts, pelvis and thighs that supports reproductive function. Every category sits about 8 to 10 percentage points higher as a result. A woman at 12 percent body fat is not lean in the way a man at 12 percent is; she is below the level her physiology needs.',
    },
    {
      question: 'What is lean body mass and why does it matter?',
      answer:
        'Lean body mass is everything that is not fat: muscle, bone, organs, and water. It is the number worth watching during weight loss, because losing weight while keeping lean mass and losing weight by shedding muscle look identical on a bathroom scale and are not remotely the same outcome. If your weight drops and your estimated lean mass drops with it, that is a signal to raise protein intake and add resistance training.',
    },
    {
      question: 'How often should I re-measure?',
      answer:
        'Every four to six weeks. Body fat changes slowly, and the measurement error is larger than a fortnight’s genuine progress, so measuring weekly mostly records tape placement rather than your body. Measure at the same time of day, under the same conditions, and compare the trend across several readings rather than any single one.',
    },
    {
      question: 'Can this replace a DEXA scan or calipers?',
      answer:
        'No, and it is not trying to. DEXA and hydrostatic weighing are reference methods; this is a regression equation fitted to tape measurements, which is why it carries a four-point error bar. Its advantage is that it costs nothing and can be repeated at home as often as you like, which makes it far better at tracking change over time than a scan you take once a year.',
    },
  ],
  sources: [
    {
      title:
        'Prediction of Percent Body Fat for U.S. Navy Men from Body Circumferences and Height — Report No. 84-11',
      publisher: 'Naval Health Research Center (via DTIC)',
      url: 'https://apps.dtic.mil/sti/tr/pdf/ADA143890.pdf',
    },
    {
      title:
        'Body mass index as a measure of body fatness: age- and sex-specific prediction formulas (Br J Nutr, 1991)',
      publisher: 'Deurenberg, Weststrate & Seidell — via PubMed',
      url: 'https://pubmed.ncbi.nlm.nih.gov/2043597/',
    },
    {
      title:
        'Looking back: BMI as a measure of body fatness — age- and sex-specific prediction formulas, thirty years later',
      publisher: 'European Journal of Clinical Nutrition — via PubMed Central',
      url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8980724/',
    },
    {
      title: 'Body Fat Percentage: Charting Averages in Men and Women',
      publisher: 'American Council on Exercise (ACE)',
      url: 'https://www.acefitness.org/about-ace/press-room/in-the-news/8602/body-fat-percentage-charting-averages-in-men-and-women-very-well-health/',
    },
  ],
  relatedSlugs: ['health/bmi-calculator', 'health/ideal-weight-calculator'],
  publishedAt: '2026-08-07',
  updatedAt: '2026-08-07',
  featured: true,
};

export default meta;
