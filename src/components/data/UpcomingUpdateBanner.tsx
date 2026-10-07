import { nextUpdate } from '@/lib/data/freshness';
import { Callout } from '@/components/ui';
import { formatDate } from '@/lib/format';
// Static pages reflect freshness at the last production build.
const builtAt=Date.now();
export function UpcomingUpdateBanner({dataset,period}:{dataset:string;period:string}){const due=nextUpdate(dataset,period);if(!due)return null;const days=(Date.parse(due)-builtAt)/86400000;if(days>45)return null;return <Callout title={days<0?'Check the next official period':'Upcoming data update'}>The next effective-period update is expected {formatDate(due)}. Displayed figures remain the published {period} dataset until a newer official file is imported.</Callout>;}

