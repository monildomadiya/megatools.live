import { expect, it } from 'vitest';
import fy26 from '../../../data/generated/per-diem/FY2026.json';
import fy27 from '../../../data/generated/per-diem/FY2027.json';
import zip from '../../../data/generated/per-diem-zip/FY2027.json';
import gi from '../../../data/manual/gi-bill/2026-2027.json';
import mie from '../../../data/manual/per-diem-mie/FY2027.json';
import { perDiemSchema } from './schema';
it('validates both inspected GSA workbooks and ZIP mapping contracts',()=>{for(const data of [fy26,fy27]){perDiemSchema.parse(data);expect(new Set(data.locations.map(l=>l.stateSlug+'/'+l.slug)).size).toBe(data.locations.length);expect(data.locations.every(l=>l.seasons.length>0)).toBe(true);}expect(fy26.locations).toHaveLength(296);expect(fy27.locations).toHaveLength(295);expect(Object.keys(zip.zips)).toHaveLength(40426);expect(Object.keys(zip.zips).every(z=>/^\d{5}$/.test(z))).toBe(true);});
it('spot-checks five published amounts in each GSA fiscal year',()=>{expect(fy26.standard).toEqual({lodging:110,mie:68});expect(fy27.standard).toEqual({lodging:113,mie:68});for(const [data,expected] of [[fy26,[126,216,420,155]],[fy27,[135,221,441,163]]] as const){for(const [i,name] of ['Birmingham','Gulf Shores','Jackson / Pinedale','Riverhead / Ronkonkoma / Melville'].entries()){const location=data.locations.find(l=>l.name===name);expect(location,name).toBeDefined();expect(Math.max(...location!.seasons.map(s=>s.lodging))).toBe(expected[i]);}}});
it('spot-checks the five GI Bill published limits',()=>{expect(gi.privateTuitionCap).toBe(3090834);expect(gi.onlineHousing).toBe(126100);expect(gi.foreignHousing).toBe(252200);expect(gi.booksMaximum).toBe(100000);expect(gi.booksPerCredit).toBe(4167);});
// GSA FY2026_PerDiemMasterRatesFile.xlsx and FY2027_PerDiemRates_Validated090126.xlsx.
it('has one official season covering every fiscal-year night and a meal tier for every locality',()=>{const errors:string[]=[];for(const data of [fy26,fy27])for(const location of data.locations){if(!mie.rates.some(r=>r.mie===location.mie))errors.push(location.name+' missing meal tier');for(let day=Date.parse(data.meta.effectiveFrom);day<=Date.parse(data.meta.effectiveTo);day+=86400000){const date=new Date(day).toISOString().slice(0,10);if(location.seasons.filter(s=>s.start<=date&&s.end>=date).length!==1)errors.push(location.name+' '+date);}}expect(errors).toEqual([]);});



