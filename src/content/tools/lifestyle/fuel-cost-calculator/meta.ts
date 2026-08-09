import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'fuel-cost-calculator',
  category: 'lifestyle',
  name: 'Fuel Cost Calculator',
  h1: 'Fuel Cost Calculator',
  metaTitle: 'Fuel Cost Calculator — Trip Cost, MPG and L/100km',
  metaDescription:
    'Work out what a journey costs in fuel, in miles per gallon or litres per 100 km, and split it between passengers — with the UK and US gallon trap explained.',
  shortDescription:
    'Work out what a journey actually costs in fuel, in whichever units your car reports, and split it fairly between the people in it.',
  keywords: [
    'fuel cost calculator',
    'petrol cost calculator',
    'trip cost calculator',
    'mpg calculator',
    'l/100km calculator',
    'cost per mile',
  ],
  faqs: [
    {
      question: 'Is a US gallon the same as a UK gallon?',
      answer:
        'No, and the difference is large. A US gallon is 3.785411784 litres and a UK imperial gallon is 4.54609 litres — about 20% bigger. A car rated at 40 mpg in the UK does about 33 mpg by the US measure without anything changing but the unit. Comparing a British and an American economy figure directly overstates the British car by a fifth, which is why this calculator asks which gallon you mean.',
    },
    {
      question: 'How do I convert mpg to litres per 100 km?',
      answer:
        'Divide 282.481 by the figure in US mpg, or 282.481 divided by 1.201 for imperial. The relationship is reciprocal rather than linear, which has a consequence worth knowing: the same improvement in mpg saves far more fuel at the low end than the high end. Going from 15 to 20 mpg saves more fuel over a given distance than going from 30 to 50 mpg does.',
    },
    {
      question: 'Why does my car never achieve its official economy figure?',
      answer:
        'Because official figures come from a standardised laboratory cycle, not from driving. Europe replaced the old NEDC test with WLTP in 2017 precisely because NEDC figures were unrealistically optimistic, and WLTP figures are closer but still measured under controlled conditions with no wind, no hills, no roof box and no air conditioning. Expect real-world consumption 10–20% above the published figure, and considerably more in cold weather or short urban trips.',
    },
    {
      question: 'How much does speed affect fuel consumption?',
      answer:
        'A great deal above about 50 mph, because aerodynamic drag rises with the square of speed and the power needed to overcome it with the cube. The US Department of Energy estimates that each 5 mph above 50 costs roughly the equivalent of paying an extra 20 to 30 cents per gallon. Driving at 70 rather than 60 on a long motorway trip typically costs 10–15% more fuel and saves less time than most people assume.',
    },
    {
      question: 'What is the real cost of driving per mile?',
      answer:
        'Fuel is usually only a third to a half of it. Depreciation, insurance, tyres, servicing and repairs all scale with distance to some degree, and depreciation is normally the largest single item. Reimbursement rates reflect this: the UK approved mileage allowance is 45p per mile for the first 10,000 miles, and the US IRS standard mileage rate is set annually — both are several times the pure fuel cost, deliberately.',
    },
    {
      question: 'Is an electric car cheaper to run?',
      answer:
        'Usually, but it depends heavily on where you charge. Home charging on an off-peak overnight tariff is typically a small fraction of the fuel cost for the same distance. Public rapid charging can cost three or four times as much per kWh and closes much of the gap. A useful comparison figure is cost per mile: work out pence or cents per kWh divided by the car’s miles per kWh, and compare against the figure this calculator gives you.',
    },
    {
      question: 'Does a full tank use more fuel because of the weight?',
      answer:
        'Marginally, and not enough to change your behaviour. A full 60-litre tank of petrol weighs about 45 kg, which on a 1,500 kg car is roughly 3% more mass. Extra mass mostly costs fuel during acceleration and hill climbing rather than at steady speed, so the real-world penalty of a full tank over a half tank is a fraction of a percent. Underinflated tyres and a roof box both cost far more.',
    },
  ],
  sources: [
    {
      title: 'Fuel Economy Guide and driving efficiency data',
      publisher: 'US Department of Energy / Environmental Protection Agency (fueleconomy.gov)',
      url: 'https://www.fueleconomy.gov/feg/driveHabits.jsp',
    },
    {
      title: 'Worldwide Harmonised Light Vehicle Test Procedure (WLTP) and fuel consumption figures',
      publisher: 'UK Vehicle Certification Agency (VCA)',
      url: 'https://www.vehicle-certification-agency.gov.uk/fuel-consumption-co2/',
    },
    {
      title: 'Travel — mileage and fuel rates and allowances',
      publisher: 'UK Government (GOV.UK) / HM Revenue & Customs',
      url: 'https://www.gov.uk/government/publications/rates-and-allowances-travel-mileage-and-fuel-allowances',
    },
  ],
  relatedSlugs: ['conversion/length-converter', 'lifestyle/tip-calculator'],
  publishedAt: '2026-08-09',
  updatedAt: '2026-08-09',
};

export default meta;
