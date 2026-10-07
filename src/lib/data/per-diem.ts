import 'server-only';
import fy26 from '../../../data/generated/per-diem/FY2026.json';
import fy27 from '../../../data/generated/per-diem/FY2027.json';
import zip26 from '../../../data/generated/per-diem-zip/FY2026.json';
import zip27 from '../../../data/generated/per-diem-zip/FY2027.json';
import mie26 from '../../../data/manual/per-diem-mie/FY2026.json';
import mie27 from '../../../data/manual/per-diem-mie/FY2027.json';
import { states, stateSlug } from '../slug';
import type { PerDiemData } from './schema';
const datasets: Record<string, PerDiemData> = { FY2026: fy26, FY2027: fy27 };
const zipMaps: Record<string, Record<string,string>> = { FY2026: zip26.zips, FY2027: zip27.zips };
export function getFiscalYears() { return Object.keys(datasets).sort(); }
export function getCurrentFY(date = new Date()) { return `FY${date.getUTCFullYear() + (date.getUTCMonth() >= 9 ? 1 : 0)}`; }
export function getPerDiem(fy = 'FY2027') { const data = datasets[fy]; if (!data) throw new Error(`Official ${fy} data is not available.`); return data; }
export function getStandardRate(fy: string) { return getPerDiem(fy).standard; }
export function getStates(fy: string) { getPerDiem(fy);return Object.keys(states).filter(code=>!['AK','HI','AS','GU','MP','PR','VI','UM'].includes(code)).map(stateSlug).sort(); }
export function getLocationsByState(fy: string, state: string) { return getPerDiem(fy).locations.filter((location)=>location.stateSlug===state); }
export function getLocation(fy: string, state: string, slug: string) { return getPerDiem(fy).locations.find((location)=>location.stateSlug===state && location.slug===slug); }
export function lookupZip(fy: string, zip: string) { if (!/^\d{5}$/.test(zip)) throw new Error('Enter a five-digit ZIP.'); const id = zipMaps[fy]?.[zip]; if (!id) throw new Error('ZIP is not listed in the CONUS source. Check the ZIP or use the official OCONUS lookup.'); return id==='standard' ? null : getPerDiem(fy).locations.find((location)=>location.id===id) ?? null; }
export function getMieBreakdown(fy: string, mie: number) { const row=(fy==='FY2026'?mie26:mie27).rates.find((row)=>row.mie===mie); if (!row) throw new Error('Missing official meal breakdown.'); return row; }
export function compareFY(key: string, a: string, b: string) { const find=(fy:string)=>getPerDiem(fy).locations.find((location)=>`${location.stateSlug}/${location.slug}`===key); return { a:find(a), b:find(b) }; }
export function perDiemParams() { return [...new Map(getFiscalYears().flatMap((fy)=>getPerDiem(fy).locations.map((location)=>[`${location.stateSlug}/${location.slug}`,{state:location.stateSlug,location:location.slug}] as const))).values()]; }

