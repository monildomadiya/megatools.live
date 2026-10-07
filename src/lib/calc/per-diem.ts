import type { MieBreakdown, PerDiemLocation } from '@/lib/data/schema';
export type TripRates = { standard: {lodging:number;mie:number}; location: PerDiemLocation | null; breakdown: MieBreakdown };
export function fiscalYear(day: string) { const date=new Date(day+'T00:00:00Z'); if(Number.isNaN(date.getTime())||date.toISOString().slice(0,10)!==day)throw new Error('Enter valid travel dates.'); return `FY${date.getUTCFullYear()+(date.getUTCMonth()>=9?1:0)}`; }
export function lodgingForDate(location: PerDiemLocation | null, standard: number, day: string) { if (!location) return standard; const season=location.seasons.find((season)=>season.start<=day&&season.end>=day); if (!season) throw new Error(`No official lodging rate for ${day}.`); return season.lodging; }
/** Nights exclude checkout; M&IE includes departure and return, with published first/last amounts. */
export function tripEstimate({start,end,rates,actual,provided}: {start:string;end:string;rates:Record<string,TripRates>;actual?:number;provided?:Record<string,{breakfast:boolean;lunch:boolean;dinner:boolean}>}) {
  if (actual!==undefined&&(!Number.isFinite(actual)||actual<0))throw new Error('Actual lodging must be a nonnegative amount.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start)||!/^\d{4}-\d{2}-\d{2}$/.test(end)||Number.isNaN(Date.parse(start))||Number.isNaN(Date.parse(end))||new Date(start).toISOString().slice(0,10)!==start||new Date(end).toISOString().slice(0,10)!==end||end<start) throw new Error('Enter valid dates with checkout after check-in.');
  const days=(Date.parse(end)-Date.parse(start))/86400000; if(days>366)throw new Error('Trips are limited to 366 nights.'); if(days===0)return {sameDay:true,rows:[],lodging:0,mie:0,total:0};
  const rows=[]; let lodging=0;let mie=0;
  for(let date=new Date(start+'T00:00:00Z');date.toISOString().slice(0,10)<=end;date.setUTCDate(date.getUTCDate()+1)){
    const day=date.toISOString().slice(0,10);const data=rates[fiscalYear(day)];if(!data)throw new Error(`Official ${fiscalYear(day)} rates are not available.`);
    const cap=day===end?0:Math.round(lodgingForDate(data.location,data.standard.lodging,day)*100);const lodgingAmount=actual===undefined?cap:Math.min(cap,Math.round(actual*100));
    const meals=provided?.[day]; const deductions=(meals?.breakfast?data.breakdown.breakfast:0)+(meals?.lunch?data.breakdown.lunch:0)+(meals?.dinner?data.breakdown.dinner:0);
    const mealAmount=Math.round(Math.max(data.breakdown.incidentals,(day===start||day===end?data.breakdown.firstLast:data.breakdown.mie)-deductions)*100);
    rows.push({day,cap,lodging:lodgingAmount,mie:mealAmount});lodging+=lodgingAmount;mie+=mealAmount;
  }
  return {sameDay:false,rows,lodging,mie,total:lodging+mie};
}


