import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';
import { metaSchema, perDiemSchema } from '../src/lib/data/schema';
import { nextUpdate } from '../src/lib/data/freshness';
const money=z.number().int().nonnegative();
const row=z.object({label:z.string().min(1),amounts:z.object({'30':money,'40':money,'50':money,'60':money,'70':money,'80':money,'90':money,'100':money})});
const latest=new Map<string,{period:string;due:string|null}>();
async function validate(directory:string):Promise<number>{let count=0;for(const entry of await readdir(directory,{withFileTypes:true})){const file=path.join(directory,entry.name);if(entry.isDirectory()){count+=await validate(file);continue;}if(!entry.name.endsWith('.json'))continue;const value:unknown=JSON.parse(await readFile(file,'utf8'));
 if(path.resolve(file)===path.resolve('data/manual/changelog.json')){z.array(z.object({date:z.iso.date(),title:z.string().min(1),description:z.string().optional(),url:z.string().optional()})).parse(value);count++;continue;}
 const {meta}=z.object({meta:metaSchema}).parse(value);
 if(meta.dataset==='per-diem')perDiemSchema.parse(value);
 else if(meta.dataset==='per-diem-zip')z.object({zips:z.record(z.string().regex(/^\d{5}$/),z.string().min(1))}).parse(value);
 else if(meta.dataset==='per-diem-mie')z.object({rates:z.array(z.object({mie:z.number().positive(),breakfast:z.number().positive(),lunch:z.number().positive(),dinner:z.number().positive(),incidentals:z.number().positive(),firstLast:z.number().positive()})).min(1)}).parse(value);
 else if(meta.dataset==='va-compensation')z.object({lowRatings:z.object({'10':money,'20':money}),rates:z.array(row).length(6),children:z.array(row).length(6),added:z.array(row).length(3)}).parse(value);
 else if(meta.dataset==='gi-bill')z.object({privateTuitionCap:money,onlineHousing:money,foreignHousing:money,booksMaximum:money,booksPerCredit:money,bahYearUsed:z.number().int(),benefitLevels:z.array(z.number()).min(1)}).parse(value);
 else if(meta.dataset==='retirement')z.object({high3Multiplier:z.number().positive(),brsMultiplier:z.number().positive(),automaticContribution:z.number().nonnegative(),automaticStartsDay:z.number().int(),matchingStartsYear:z.number().int(),contributionsEndCompletedYear:z.number().int()}).parse(value);
 const current=latest.get(meta.dataset);if(!current||meta.period>current.period)latest.set(meta.dataset,{period:meta.period,due:nextUpdate(meta.dataset,meta.period)});count++;
 }return count;}
async function main(){const count=await validate('data/generated')+await validate('data/manual');for(const [dataset,current] of latest){if(current.due&&Date.now()>=Date.parse(current.due))console.warn(`WARNING: ${dataset} ${current.period}: next official update expected ${current.due}; verify whether a newer file is published.`);}console.log(`Validated ${count} JSON files. Freshness warnings are advisory.`);}
main().catch((error:unknown)=>{console.error(error);process.exitCode=1;});
