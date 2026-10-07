export type RouteSection = 'core' | 'per-diem' | 'bah' | 'military-pay' | 'va' | 'tools';
export type Route = { path: string; title: string; section: RouteSection; status: 'live' | 'soon'; navTitle?: string; description?: string };
/** URL contract, including templates reserved for later data tasks. */
export const routes: Route[] = [
  { path: '/', title: 'Home', section: 'core', status: 'live' },
  { path: '/per-diem', title: 'Per Diem', navTitle: 'Per Diem', section: 'per-diem', status: 'live', description: 'Find CONUS lodging and meal rates, then estimate a trip.' },
  { path: '/per-diem/calculator', title: 'Trip per diem calculator', section: 'per-diem', status: 'live' },
  { path: '/per-diem/[state]', title: 'State per diem rates', section: 'per-diem', status: 'live' },
  { path: '/per-diem/[state]/[location]', title: 'Location per diem rates', section: 'per-diem', status: 'live' },
  { path: '/bah', title: 'BAH', navTitle: 'BAH', section: 'bah', status: 'live', description: 'Compare verified housing allowances with rent and utilities.' },
  { path: '/bah/state/[state]', title: 'State BAH rates', section: 'bah', status: 'soon' },
  { path: '/bah/[mha]', title: 'Military Housing Area rates', section: 'bah', status: 'soon' },
  { path: '/military-pay', title: 'Military Pay', navTitle: 'Military Pay', section: 'military-pay', status: 'live', description: 'Estimate take-home pay from verified pay and deductions.' },
  { path: '/military-pay/calculator', title: 'Take-home pay estimator', section: 'military-pay', status: 'live' },
  { path: '/military-pay/chart/[year]', title: 'Basic pay chart', section: 'military-pay', status: 'soon' },
  { path: '/military-pay/[grade]', title: 'Pay grade rates', section: 'military-pay', status: 'soon' },
  { path: '/bas', title: 'BAS rates', section: 'military-pay', status: 'live' },
  { path: '/va-disability', title: 'VA Disability', navTitle: 'VA Disability', section: 'va', status: 'live', description: 'Combine disability ratings and look up compensation.' },
  { path: '/va-disability/calculator', title: 'Combined rating calculator', section: 'va', status: 'live' },
  { path: '/va-disability/rates/[year]', title: 'VA compensation rates', section: 'va', status: 'live' },
  { path: '/pcs/calculator', title: 'PCS travel calculator', navTitle: 'PCS', section: 'tools', status: 'live', description: 'Build a travel budget and estimate PPM net proceeds.' },
  { path: '/pcs/ppm-estimator', title: 'PPM net estimator', section: 'tools', status: 'live' },
  { path: '/gi-bill/calculator', title: 'GI Bill estimator', navTitle: 'GI Bill', section: 'tools', status: 'live', description: 'Estimate Post-9/11 GI Bill housing benefits.' },
  { path: '/military-retirement/calculator', title: 'Military retirement calculator', navTitle: 'Retirement', section: 'tools', status: 'live', description: 'Compare High-3 and Blended Retirement System projections.' },
  { path: '/military-time', title: 'Military Time', navTitle: 'Military Time', section: 'tools', status: 'live', description: 'Convert between 12-hour and 24-hour time.' },
  { path: '/military-time/[hhmm]', title: 'Hourly military time', section: 'tools', status: 'live' },
  ...['About', 'Contact', 'Privacy', 'Terms', 'Disclaimer', 'Sources', 'Updates'].map((title): Route => ({ path: `/${title.toLowerCase()}`, title, section: 'core', status: 'live' })),
];
export const navigationRoutes = routes.filter((route) => route.navTitle);
export const trustRoutes = routes.filter((route) => route.section === 'core' && route.path !== '/');
/** Unreleased routes point to their home-page card until their pages exist. */
export function routeHref(route: Route): string {
  return route.status === 'live' ? route.path : `/#tool-${route.section === 'tools' ? route.path.split('/')[1] : route.section}`;
}



