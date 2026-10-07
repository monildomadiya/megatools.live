import { readFile } from 'node:fs/promises';
const origin='http://127.0.0.1:3000';
const manifest=JSON.parse(await readFile('.next/prerender-manifest.json','utf8'));
const paths=Object.keys(manifest.routes).filter(p=>!p.startsWith('/_'));
let verified=0;const counts={};
for(let index=0;index<paths.length;index+=12){await Promise.all(paths.slice(index,index+12).map(async path=>{
 const response=await fetch(origin+path);if(!response.ok)throw new Error(`${path}: HTTP ${response.status}`);const body=await response.text();
 if(response.headers.get('content-type')?.includes('text/html')){const title=/<title>(.*?)<\/title>/.exec(body)?.[1];if(!title||title.length>60)throw new Error(`${path}: missing/long title`);if(!body.includes('rel="canonical"'))throw new Error(`${path}: missing canonical`);if(body.includes('"@type":"FAQPage"'))throw new Error(`${path}: prohibited FAQ schema`);if(!body.includes('MegaTools is an independent website'))throw new Error(`${path}: missing disclaimer`);if(!body.includes('"@type":"BreadcrumbList"'))throw new Error(`${path}: missing breadcrumbs`);counts[path.split('/')[1]||'home']=(counts[path.split('/')[1]||'home']??0)+1;}
 verified++;
 }));}
const unknown=await fetch(origin+'/this-route-does-not-exist');if(unknown.status!==404)throw new Error('Unknown route must return 404');
const zip=await fetch(origin+'/api/per-diem?zip=10001&fy=FY2027');const result=await zip.json();if(!zip.ok||result.location?.name!=='New York City'||result.zips)throw new Error('Single-ZIP lookup contract failed');
const bad=await fetch(origin+'/api/per-diem?zip=abc&fy=FY2027');if(bad.status!==400)throw new Error('Invalid ZIP must return 400');
console.log(`Verified ${verified} prerendered endpoints, canonical/title/breadcrumb/disclaimer contracts, 404, and ZIP API.`);console.log(counts);

