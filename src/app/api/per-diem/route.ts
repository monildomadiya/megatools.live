import { NextRequest, NextResponse } from 'next/server';
import { getPerDiem, getLocation, lookupZip, getMieBreakdown } from '@/lib/data/per-diem';
export async function GET(request: NextRequest) {
  try { const fy=request.nextUrl.searchParams.get('fy')??'FY2027';const zip=request.nextUrl.searchParams.get('zip');const key=request.nextUrl.searchParams.get('location');const data=getPerDiem(fy);
    let location=null;
    if(zip)location=lookupZip(fy,zip); else if(key&&key!=='standard'){const [state,slug]=key.split('/');if(!state||!slug||key.split('/').length!==2)throw new Error('Invalid location.');location=getLocation(fy,state,slug)??null;if(!location&&!getLocation('FY2026',state,slug)&&!getLocation('FY2027',state,slug))throw new Error('Unknown location.');}else if(key!=='standard')throw new Error('Enter a ZIP or choose a location.');
    const mie=location?.mie??data.standard.mie;
    const month=new Date().getUTCMonth();const year=Number(fy.slice(2))-(month>=9?1:0);const from=new Date(Date.UTC(year,month,1)).toISOString().slice(0,10);const to=new Date(Date.UTC(year,month+1,0)).toISOString().slice(0,10);const amounts=location?.seasons.filter(s=>s.start<=to&&s.end>=from).map(s=>s.lodging)??[data.standard.lodging];
    return NextResponse.json({fy,zip,location,mie,lodging:{currentMonth:{from,to,min:Math.min(...amounts),max:Math.max(...amounts)},seasons:location?.seasons??[{start:data.meta.effectiveFrom,end:data.meta.effectiveTo,lodging:data.standard.lodging}]},standard:data.standard,breakdown:getMieBreakdown(fy,mie),url:location?`/per-diem/${location.stateSlug}/${location.slug}`:'/per-diem',meta:data.meta},{headers:{'Cache-Control':'public, max-age=86400','X-Robots-Tag':'noindex'}});
  } catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Lookup failed.'},{status:400,headers:{'X-Robots-Tag':'noindex'}});}
}
