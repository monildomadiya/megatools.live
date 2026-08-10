import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'water-intake-calculator',
  category: 'health',
  name: 'Water Intake Calculator',
  h1: 'Water Intake Calculator',
  metaTitle: 'Water Intake Calculator — Daily Hydration Needs',
  metaDescription:
    'Estimate how much water you need per day from your weight, activity and climate, checked against the EFSA and US National Academies reference intakes for water.',
  shortDescription:
    'Estimate a daily water target from your body weight, training load and climate, and see how it compares with official reference intakes.',
  leadAnswer:
    'Daily water needs are usually estimated at 30 to 35 millilitres per kilogram of body weight, adjusted for exercise and heat. Official reference intakes cover total water from all sources: EFSA sets an adequate intake of 2.0 litres a day for women and 2.5 for men, roughly a fifth of which arrives in food.',
  keywords: [
    'water intake calculator',
    'how much water should i drink',
    'daily water intake',
    'hydration calculator',
    'water per kg body weight',
    'daily fluid requirement',
  ],
  faqs: [
    {
      question: 'How much water should I drink a day?',
      answer:
        'For a sedentary adult in a temperate climate, roughly 30 to 35 millilitres per kilogram of body weight of total water is a reasonable working figure — about 2.3 to 2.7 litres for a 75 kg person, of which perhaps a fifth comes from food. Exercise, heat, illness, pregnancy and breastfeeding all raise it, sometimes substantially.',
    },
    {
      question: 'Where does the “eight glasses a day” rule come from?',
      answer:
        'It has no identifiable scientific origin. The physiologist Heinz Valtin searched for one in a 2002 review and found none. The nearest candidate is a 1945 US Food and Nutrition Board note suggesting about 2.5 litres a day, which added that most of that quantity is already contained in prepared foods — a sentence that was dropped as the advice was repeated.',
    },
    {
      question: 'Do tea, coffee and juice count towards my intake?',
      answer:
        'Yes. All drinks contribute to fluid intake, and the diuretic effect of moderate caffeine does not outweigh the water the drink itself supplies. The NHS counts tea and coffee as part of daily fluid intake. Alcohol is the genuine exception: it suppresses vasopressin and produces a net fluid loss at typical drinking volumes.',
    },
    {
      question: 'How much extra water do I need when I exercise?',
      answer:
        'Sweat rates vary enormously — roughly 0.5 to 2.0 litres per hour depending on intensity, heat, humidity and the individual. The reliable way to find yours is to weigh yourself before and after a session: each kilogram lost is about one litre of fluid. The American College of Sports Medicine recommends limiting losses to under about 2% of body weight.',
    },
    {
      question: 'Can you drink too much water?',
      answer:
        'Yes, and it can be dangerous. Drinking well beyond what the kidneys can excrete — roughly 0.7 to 1.0 litres per hour — dilutes blood sodium and causes hyponatraemia, which in severe cases is fatal. It is most often seen in endurance events where athletes over-drink plain water while losing sodium in sweat. More is not better past the point of need.',
    },
    {
      question: 'What is the simplest way to tell if I am drinking enough?',
      answer:
        'Urine colour. Pale straw suggests adequate hydration; dark yellow or amber suggests you are behind. Thirst is a reasonable guide too for most healthy adults under 65, though it lags behind actual need during hard exercise and blunts with age. Neither is precise, but both are more informative than counting glasses.',
    },
    {
      question: 'Do older adults need a different amount?',
      answer:
        'The requirement does not fall much, but the thirst signal weakens with age and kidney concentrating ability declines, so older adults dehydrate more easily without noticing. Drinking to a schedule rather than to thirst is commonly advised over about 65, particularly during hot weather or illness.',
    },
    {
      question: 'Does drinking more water help with weight loss?',
      answer:
        'Modestly, and indirectly. Water has no calories, so replacing sugary drinks with it cuts intake, and drinking before a meal slightly reduces how much people eat in some trials. There is no evidence that drinking beyond your needs raises metabolism enough to matter.',
    },
  ],
  sources: [
    {
      title: 'Scientific Opinion on Dietary Reference Values for water (EFSA Journal, 2010)',
      publisher: 'European Food Safety Authority',
      url: 'https://www.efsa.europa.eu/en/efsajournal/pub/1459',
    },
    {
      title:
        'Dietary Reference Intakes for Water, Potassium, Sodium, Chloride, and Sulfate (2005)',
      publisher: 'National Academies of Sciences, Engineering, and Medicine',
      url: 'https://nap.nationalacademies.org/catalog/10925/dietary-reference-intakes-for-water-potassium-sodium-chloride-and-sulfate',
    },
    {
      title: '“Drink at least eight glasses of water a day.” Really? (Am J Physiol, 2002)',
      publisher: 'Heinz Valtin, Dartmouth Medical School',
      url: 'https://pubmed.ncbi.nlm.nih.gov/12376390/',
    },
    {
      title: 'ACSM Position Stand: Exercise and Fluid Replacement',
      publisher: 'American College of Sports Medicine',
      url: 'https://pubmed.ncbi.nlm.nih.gov/17277604/',
    },
    {
      title: 'Water, drinks and your health',
      publisher: 'NHS',
      url: 'https://www.nhs.uk/live-well/eat-well/food-guidelines-and-food-labels/water-drinks-nutrition/',
    },
  ],
  relatedSlugs: ['health/tdee-calculator', 'conversion/weight-converter'],
  publishedAt: '2026-08-10',
  updatedAt: '2026-08-10',
};

export default meta;
