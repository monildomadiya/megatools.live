'use client';
import { useState } from 'react';
import { NumberField, ResultPanel } from './index';
import { housingBudget, takeHome, pcsBudget, ppmNet } from '@/lib/calc/allowances';
import { formatUSD } from '@/lib/format';
type Kind='bah'|'pay'|'pcs'|'ppm';
const fields:Record<Kind,{key:string;label:string;unit?:boolean;value?:string}[]>={
 bah:[{key:'bah',label:'Official monthly BAH ($)'},{key:'rent',label:'Monthly rent or mortgage ($)'},{key:'utilities',label:'Monthly utilities ($)'}],
 pay:[{key:'basic',label:'Monthly basic pay from official chart ($)'},{key:'bah',label:'Monthly BAH ($)'},{key:'bas',label:'Monthly BAS ($)'},{key:'other',label:'Monthly other pay ($)'},{key:'deductions',label:'Monthly taxes and other deductions, excluding TSP ($)'},{key:'tsp',label:'TSP contribution (% of basic pay)',unit:true}],
 pcs:[{key:'dla',label:'Official authorized DLA ($)'},{key:'miles',label:'Authorized travel distance (miles)',unit:true},{key:'rate',label:'Official MALT rate ($ per mile)'},{key:'vehicles',label:'Authorized vehicles',unit:true,value:'1'},{key:'days',label:'Authorized travel days',unit:true},{key:'daily',label:'Combined authorized travel per diem for family ($ per day)'},{key:'lodging',label:'Authorized temporary lodging reimbursement ($)'},{key:'other',label:'Other authorized reimbursements ($)'}],
 ppm:[{key:'incentive',label:'Government PPM incentive quote ($)'},{key:'expenses',label:'Total moving expenses ($)'},{key:'withholding',label:'Assumed withholding (%)',unit:true}],
};
export function AllowanceCalculator({kind}:{kind:Kind}){
 const [values,setValues]=useState<Record<string,string>>(()=>Object.fromEntries(fields[kind].map(f=>[f.key,f.value??''])));let rows:{label:string;value:number}[]=[];let error='';const complete=fields[kind].every(f=>values[f.key]!==undefined&&values[f.key]!=='');
 try{if(complete){const n=(key:string)=>Number(values[key]);const c=(key:string)=>Math.round(n(key)*100);
 if(kind==='bah'){const r=housingBudget(c('bah'),c('rent'),c('utilities'));rows=[{label:'Monthly BAH',value:r.monthly},{label:'Annual BAH',value:r.annual},{label:'Housing cost',value:r.cost},{label:'Monthly remaining / shortfall',value:r.remaining}];}
 if(kind==='pay'){const r=takeHome(c('basic'),c('bah'),c('bas'),c('other'),c('deductions'),n('tsp')/100);rows=[{label:'Monthly gross',value:r.gross},{label:'Monthly TSP',value:r.tsp},{label:'Estimated monthly net',value:r.net},{label:'Estimated annual net',value:r.annual}];}
 if(kind==='pcs'){const r=pcsBudget(c('dla'),n('miles'),n('rate')*100,n('vehicles'),n('days'),c('daily'),c('lodging'),c('other'));rows=[{label:'Mileage allowance',value:r.mileage},{label:'Family travel per diem',value:r.perDiem},{label:'Total estimated reimbursements',value:r.total}];}
 if(kind==='ppm'){const r=ppmNet(c('incentive'),c('expenses'),n('withholding')/100);rows=[{label:'Before withholding',value:r.gross},{label:'Assumed withheld amount',value:r.withheld},{label:'Estimated cash after costs',value:r.cash}];}
 }}catch(e){error=e instanceof Error?e.message:'Check your inputs.';}
 return <div className="grid gap-6 lg:grid-cols-2"><div className="space-y-5 rounded-2xl border border-border bg-white p-6"><p className="text-sm text-muted">Enter verified amounts from your official rate lookup, LES, or authorized travel estimate. Enter 0 for items that do not apply.</p>{fields[kind].map(f=><NumberField key={f.key} id={kind+'-'+f.key} label={f.label} min={0} max={f.key==='tsp'||f.key==='withholding'?100:undefined} step={f.unit?'1':'0.01'} value={values[f.key]??''} onChange={e=>setValues({...values,[f.key]:e.target.value})}/>)}</div><ResultPanel title="Your planning estimate">{error?<p className="text-red-700">{error}</p>:!complete?<p>Complete all fields to calculate your estimate.</p>:rows.map(row=><div key={row.label} className="flex justify-between gap-4 border-b border-border py-4"><span>{row.label}</span><strong className="tabular-nums">{formatUSD(row.value)}</strong></div>)}<p className="mt-6 text-sm text-muted">This calculation uses your inputs. It does not determine entitlement, calculate tax liability, or replace an official award or travel authorization.</p></ResultPanel></div>;
}
