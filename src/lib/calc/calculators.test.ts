import { describe, expect, it } from 'vitest';
import { tripEstimate, fiscalYear } from './per-diem';
import { vaCombined, vaCompensation } from './va-combined';
import { giEstimate } from './gi-bill';
import { pension, governmentTspRate, futureValue, pensionProjection, projectTsp } from './retirement';
import { parseTime, zuluToZone, hourlyTimes } from './military-time';
import { housingBudget, takeHome, pcsBudget, ppmNet } from './allowances';
import va from '../../../data/manual/va-compensation/2026.json';
import gi from '../../../data/manual/gi-bill/2026-2027.json';
import retirement from '../../../data/manual/retirement/current-rules.json';
import mie from '../../../data/manual/per-diem-mie/FY2027.json';
import fy27 from '../../../data/generated/per-diem/FY2027.json';
const rates={FY2026:{standard:{lodging:110,mie:68},location:null,breakdown:mie.rates[0]!},FY2027:{standard:{lodging:113,mie:68},location:null,breakdown:mie.rates[0]!}};
describe('GSA trip calculation',()=>{
 it('changes lodging at an official season boundary',()=>{const location=fy27.locations.find(l=>l.name==='Gulf Shores')!;const result=tripEstimate({start:'2027-05-31',end:'2027-06-02',rates:{FY2027:{standard:fy27.standard,location,breakdown:mie.rates.find(r=>r.mie===74)!}}});expect(result.lodging).toBe(39800);expect(result.total).toBe(58300);});
 it('uses the rate on each fiscal-year date and excludes checkout lodging',()=>{expect(fiscalYear('2026-09-30')).toBe('FY2026');const r=tripEstimate({start:'2026-09-30',end:'2026-10-02',rates});expect(r.lodging).toBe(22300);expect(r.mie).toBe(17000);expect(r.total).toBe(39300);expect(r.rows.at(-1)?.cap).toBe(0);});
 it('caps actual lodging and floors meal deductions at incidentals',()=>{const r=tripEstimate({start:'2026-10-01',end:'2026-10-02',rates,actual:80,provided:{'2026-10-01':{breakfast:true,lunch:true,dinner:true}}});expect(r.lodging).toBe(8000);expect(r.mie).toBe(5600);});
 it('handles same-day trips explicitly and rejects unsupported or invalid dates',()=>{expect(tripEstimate({start:'2026-10-01',end:'2026-10-01',rates}).sameDay).toBe(true);expect(()=>tripEstimate({start:'2026-02-30',end:'2026-03-02',rates})).toThrow();expect(()=>tripEstimate({start:'2027-10-01',end:'2027-10-02',rates})).toThrow(/not available/);expect(()=>tripEstimate({start:'2026-10-01',end:'2026-10-02',rates,actual:-1})).toThrow();});
});
describe('VA CFR examples and compensation',()=>{
 it.each([[60,40,76,80],[50,30,65,70],[10,10,19,20]])('combines %i and %i', (a,b,exact,rating)=>{expect(vaCombined([{rating:a,side:'none'},{rating:b,side:'none'}])).toMatchObject({exact,rating});});
 it('rounds only the final combined rating to ten',()=>{expect(vaCombined([60,40,20].map(rating=>({rating,side:'none'})))).toMatchObject({exact:81,rating:80});expect(vaCombined([]).rating).toBe(0);expect(vaCombined([{rating:100,side:'none'}]).rating).toBe(100);});
 it('applies bilateral factor without reducing the award',()=>{expect(vaCombined([{rating:10,side:'left-leg'},{rating:10,side:'right-leg'}])).toMatchObject({exact:21,rating:20,bilateral:21});expect(vaCombined([{rating:60,side:'none'},{rating:20,side:'none'},{rating:10,side:'left-leg'},{rating:10,side:'right-leg'}]).rating).toBe(70);});
 it('spot-checks five published VA values',()=>{expect(va.lowRatings['10']).toBe(18042);expect(va.lowRatings['20']).toBe(35666);expect(va.rates[0]!.amounts['30']).toBe(55247);expect(va.rates[0]!.amounts['100']).toBe(393858);expect(va.rates[1]!.amounts['100']).toBe(415817);});
 it('does not add dependents below 30%',()=>{const deps={spouse:true,parents:2,children:3,school:1,attendance:true};expect(vaCompensation(va,20,deps)).toBe(35666);expect(vaCompensation(va,100,{...deps,parents:0,children:0,school:0,attendance:false})).toBe(415817);});
});
describe('GI Bill academic-year rules',()=>{
 const input={benefit:100,credits:12,fullTimeCredits:12,annualCredits:24,months:9,tuition:4000000,privateSchool:true,online:true,housing:0,eligibleHousing:true,booksAlreadyPaid:0};
 it('uses published online, tuition, and books limits',()=>{expect(giEstimate(gi,input)).toMatchObject({monthlyHousing:126100,annualHousing:1134900,books:100000,tuitionCovered:3090834,outOfPocket:909166});});
 it('excludes half-time housing and active-duty housing',()=>{expect(giEstimate(gi,{...input,credits:6}).monthlyHousing).toBe(0);expect(giEstimate(gi,{...input,eligibleHousing:false}).monthlyHousing).toBe(0);});
 it('prorates pursuit and benefit level, accounting for prior books payments',()=>{expect(giEstimate(gi,{...input,benefit:80,credits:8,booksAlreadyPaid:70000})).toMatchObject({monthlyHousing:70616,pursuit:0.7,books:10000});});
});
describe('regular active-duty retirement',()=>{
 it('compares 20-year pensions using cents',()=>{expect(pension(retirement,600000,20)).toEqual({high3:300000,brs:240000});expect(()=>pension(retirement,600000,19)).toThrow();});
 it('honors 60-day, two-year, and 26-year contribution boundaries',()=>{expect(governmentTspRate(retirement,59,0.05)).toBe(0);expect(governmentTspRate(retirement,60,0.05)).toBe(0.01);expect(governmentTspRate(retirement,2*365.25,0.05)).toBe(0.05);expect(governmentTspRate(retirement,2*365.25,0.04)).toBeCloseTo(0.045);expect(governmentTspRate(retirement,26*365.25,0.05)).toBe(0);});
 it('handles zero-return projections and inflation',()=>{expect(futureValue(100000,10000,1,0)).toBe(220000);expect(projectTsp(retirement,{balance:0,monthlyPay:500000,memberRate:0.05,currentYos:25,retirementYos:27,annualReturn:0})).toBe(900000);expect(pensionProjection(300000,10,0.02,0.02).todaysDollars).toBeCloseTo(300000,0);});
});
describe('military and Zulu time',()=>{
 it.each([['0000','12:00 AM'],['0030','12:30 AM'],['1200','12:00 PM'],['1230','12:30 PM'],['2359','11:59 PM'],['2400','12:00 AM'],['1:30 pm','1:30 PM']])('converts %s', (input,twelve)=>expect(parseTime(input).twelve).toBe(twelve));
 it.each(['2460','2401','2500','13:60','0 pm','13 am','abc'])('rejects %s',input=>expect(()=>parseTime(input)).toThrow());
 it('accounts for the DST transition and end-of-day rollover',()=>{expect(zuluToZone('2026-03-08','0630','America/New_York')).toContain('1:30 AM');expect(zuluToZone('2026-03-08','0730','America/New_York')).toContain('3:30 AM');expect(zuluToZone('2026-10-07','2400','UTC')).toContain('Oct 8');expect(hourlyTimes).toHaveLength(24);expect(()=>zuluToZone('2026-02-30','1200','UTC')).toThrow();});
});
describe('verified-input planning tools',()=>{
 it('calculates housing surplus, pay cash flow, PCS, and PPM',()=>{expect(housingBudget(200000,150000,20000).remaining).toBe(30000);expect(takeHome(400000,200000,40000,0,100000,0.05).net).toBe(520000);expect(pcsBudget(100000,1000,23.5,2,3,15000,20000,0).total).toBe(212000);expect(ppmNet(500000,300000,0.2)).toEqual({gross:200000,withheld:100000,cash:100000});});
 it('rejects negative amounts and percentages outside range',()=>{expect(()=>housingBudget(-1,0,0)).toThrow();expect(()=>ppmNet(0,0,1.5)).toThrow();});
});

