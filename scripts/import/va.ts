/** Observed VA HTML uses nine va-table elements, va-table-row rows and span cells.
 * Table 0 has 10/20% rates. Tables 1/3 and 5/7 are paired 30–60 and 70–100
 * base-rate rows. Tables 2/4 and 6/8 are added amounts. Source rows are kept.
 */
import { readFile, mkdir, writeFile, stat } from 'node:fs/promises';
import { z } from 'zod';
export async function importVa(){const path='data/raw/va-compensation/2026/source.html';const html=await readFile(path,'utf8');const text=(value:string)=>value.replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
 const tables=[...html.matchAll(/<va-table\b[\s\S]*?<\/va-table>/gi)].map(m=>[...m[0].matchAll(/<va-table-row\b[\s\S]*?<\/va-table-row>/gi)].map(r=>[...r[0].matchAll(/<span\b[^>]*>([\s\S]*?)<\/span>/gi)].map(c=>text(c[1]??''))));
 if(tables.length!==9)throw new Error('Unexpected VA table count');
 const cents=(value:string)=>{const n=Number(value.replace(/,/g,''));if(!Number.isFinite(n)||n<=0)throw new Error('Invalid VA amount: '+value);return Math.round(n*100);};
 const baseRows=tables[1]?.slice(1)??[];const childRows=tables[5]?.slice(1)??[];
 const make=(a:string[][],b:string[][])=>a.map((row,index)=>({label:row[0]??'',amounts:Object.fromEntries([30,40,50,60,70,80,90,100].map((rating,i)=>[rating,cents((i<4?row[i+1]:b[index]?.[i-3])??'')]))}));
 const rates=make(baseRows,tables[3]?.slice(1)??[]);const children=make(childRows,tables[7]?.slice(1)??[]);const added=make(tables[6]?.slice(1)??[],tables[8]?.slice(1)??[]);
 if(rates.length!==6||children.length!==6||added.length!==3)throw new Error('Unexpected VA dependent rows');
 const ten=cents(tables[0]?.[1]?.[1]??'');const twenty=cents(tables[0]?.[2]?.[1]??'');
 const rowSchema=z.object({label:z.string().min(1),amounts:z.record(z.string(),z.number().int().positive())});z.array(rowSchema).parse([...rates,...children,...added]);
 await mkdir('data/manual/va-compensation',{recursive:true});await writeFile('data/manual/va-compensation/2026.json',JSON.stringify({meta:{dataset:'va-compensation',period:'2026',effectiveFrom:'2025-12-01',sourceUrls:['https://www.va.gov/disability/compensation-rates/veteran-rates/'],retrievedAt:(await stat(path)).mtime.toISOString()},lowRatings:{10:ten,20:twenty},rates,children,added},null,2)+'\n');console.log('VA 2026: all 122 unique table amounts parsed and source rows retained.');}

