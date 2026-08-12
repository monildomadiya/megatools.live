import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'car-running-cost-calculator',
  category: 'lifestyle',
  name: 'Car Running Cost Calculator',
  h1: 'Car Running Cost Calculator',
  metaTitle: 'Car Running Cost Calculator — Cost Per Mile',
  metaDescription:
    'Work out what a car really costs per mile or kilometre, including the depreciation nobody sends you a bill for, and what one extra journey actually adds.',
  shortDescription:
    'Work out the true cost per mile of running a car, including depreciation, and what one extra trip actually costs.',
  leadAnswer:
    'The cost of running a car is the sum of what it loses in value, what it costs to keep on the road, and what it burns while moving, divided by the distance driven. Depreciation is usually the largest of the three and the only one that never arrives as a bill.',
  keywords: [
    'car running cost calculator',
    'cost per mile calculator',
    'car cost calculator',
    'true cost of car ownership',
    'depreciation per mile',
    'driving cost calculator',
  ],
  faqs: [
    {
      question: 'Why is depreciation included when I have not sold the car?',
      answer:
        'Because it is being spent whether or not it is invoiced. A car bought for 30,000 and worth 15,000 five years later has cost 3,000 a year, and that money is gone as surely as any fuel bill. Leaving it out is what makes people believe driving costs only the fuel — and it is the reason cost-per-mile figures published by motoring organisations are several times what most drivers assume.',
    },
    {
      question: 'What is the difference between average and marginal cost per mile?',
      answer:
        'Average cost divides everything by the distance driven, so it includes insurance and depreciation that would be paid anyway. Marginal cost is what one extra journey adds — mostly fuel, plus a share of wear. For deciding whether to make a particular trip, marginal is the honest figure; for deciding whether to keep the car at all, average is.',
    },
    {
      question: 'Does mileage affect depreciation?',
      answer:
        'Strongly, and non-linearly. Value falls with both age and distance, with the steepest loss in the first year of ownership. High annual mileage accelerates it, and there are thresholds in the used market — crossing a round number of miles can move a price more than the mile itself justifies. If you drive a lot, a car already a few years past its steepest drop absorbs less of the loss.',
    },
    {
      question: 'What should the reimbursement rates be compared against?',
      answer:
        'Both the IRS standard mileage rate in the US and the HMRC approved rates in the UK are intended to cover the full cost of running a vehicle — fuel, wear, insurance and depreciation — not just fuel. Published rates change, so check the current figure rather than a remembered one. If your own cost per mile is well below the rate, business mileage is being reimbursed generously; well above, and it is not.',
    },
    {
      question: 'What is usually missing from a calculation like this?',
      answer:
        'Parking and tolls, finance interest if the car was bought on credit, the opportunity cost of capital if it was not, breakdown cover, cleaning, and the occasional large repair that has not happened yet. The last one matters most: an average annual maintenance figure understates an older car, where the cost is not spread evenly but arrives in single large amounts.',
    },
    {
      question: 'How do electric cars change the arithmetic?',
      answer:
        'They move cost between categories rather than removing it. Energy per mile is usually much cheaper, especially charging at home overnight, and servicing is lighter. Purchase prices are higher and depreciation has been less predictable, which is the largest term in the sum. Run the numbers with your own charging mix — home and public rates differ enough to change the answer entirely.',
    },
    {
      question: 'Is it cheaper to keep an old car or replace it?',
      answer:
        'Usually to keep it, until repairs approach the depreciation you would take on a newer one. An older car has already lost most of its value, so its depreciation term is small; a replacement restarts the steepest part of the curve. The comparison is repair costs plus the old car’s remaining depreciation against the new car’s depreciation plus its own running costs — not repair costs against zero.',
    },
  ],
  sources: [
    {
      title: 'Standard mileage rates',
      publisher: 'US Internal Revenue Service',
      url: 'https://www.irs.gov/tax-professionals/standard-mileage-rates',
    },
    {
      title: 'Travel — mileage and fuel rates and allowances',
      publisher: 'HM Revenue & Customs (GOV.UK)',
      url: 'https://www.gov.uk/government/publications/rates-and-allowances-travel-mileage-and-fuel-allowances',
    },
    {
      title: 'Your Driving Costs — annual analysis of the cost of vehicle ownership',
      publisher: 'American Automobile Association (AAA)',
      url: 'https://newsroom.aaa.com/auto/your-driving-costs/',
    },
  ],
  relatedSlugs: ['lifestyle/fuel-cost-calculator', 'conversion/fuel-economy-converter'],
  publishedAt: '2026-08-12',
  updatedAt: '2026-08-12',
};

export default meta;
