/** Observed GSA files: FY2026 Master sheet has 652 rows, headers at row 2,
 * columns ID, STATE, DESTINATION, COUNTY/LOCATION DEFINED, SEASON BEGIN/END,
 * FY26 Lodging Rate, FY26 M&IE. 649 valid season rows. FY2027 Sheet1 has 644
 * rows, the same headers without ID, 641 valid season rows, dates include years.
 * ZIP sheets: 42,359 rows each; row 1 DestinationID, Name, County,
 * LocationDefined, State, Zip/ZIP, FiscalYear, Oct..Sep, Meals (20 columns).
 * ZIP rows include Standard Rate (ID 0). Master rates are authoritative;
 * ZIP identifiers are joined by state + destination name, never by row order.
 */
import ExcelJS from 'exceljs';
import { mkdir, readdir, writeFile, stat } from 'node:fs/promises';
import { slugify, stateSlug } from '../../src/lib/slug';
import { perDiemSchema, type PerDiemLocation } from '../../src/lib/data/schema';
function date(value: string, fy: number, end = false): string {
  if (!value.trim()) return `${end ? fy : fy - 1}-${end ? '09-30' : '10-01'}`;
  const withYear = /\d{4}/.test(value) ? value : `${value}, ${/^(October|November|December)/.test(value) ? fy - 1 : fy}`;
  const parsed = new Date(`${withYear} UTC`);
  if (Number.isNaN(parsed.getTime())) throw new Error(`Invalid GSA season: ${value}`);
  return parsed.toISOString().slice(0, 10);
}
export async function importPerDiem() {
  for (const period of (await readdir('data/raw/gsa-per-diem')).sort()) {
    if (!/^FY\d{4}$/.test(period)) continue;
    const fy = Number(period.slice(2)); const dir = `data/raw/gsa-per-diem/${period}`;
    const files = await readdir(dir); const zipFile = files.find((name) => /zip/i.test(name)); const masterFile = files.find((name) => !/zip/i.test(name) && name.endsWith('.xlsx'));
    if (!zipFile || !masterFile) throw new Error(`Missing master or ZIP workbook for ${period}`);
    const zipBook = new ExcelJS.Workbook(); await zipBook.xlsx.readFile(`${dir}/${zipFile}`); const zipSheet = zipBook.worksheets[0];
    const book = new ExcelJS.Workbook(); await book.xlsx.readFile(`${dir}/${masterFile}`); const sheet = book.worksheets[0];
    if (!sheet || !zipSheet || zipSheet.getRow(1).getCell(1).text !== 'DestinationID') throw new Error('Unexpected workbook layout');
    const hasId = sheet.getRow(2).getCell(1).text === 'ID'; const offset = hasId ? 1 : 0;
    if (sheet.getRow(2).getCell(1 + offset).text !== 'STATE' || sheet.getRow(2).getCell(2 + offset).text !== 'DESTINATION') throw new Error('Unexpected GSA master headers');
    const zipIds = new Map<string, string>();
    for (let row = 2; row <= zipSheet.rowCount; row++) { const r = zipSheet.getRow(row); zipIds.set(`${r.getCell(5).text}-${slugify(r.getCell(2).text)}`, r.getCell(1).text); }
    const locations = new Map<string, PerDiemLocation>();
    for (let row = 4; row <= sheet.rowCount; row++) {
      const r = sheet.getRow(row); const state = r.getCell(1 + offset).text.trim(); if (!/^[A-Z]{2}$/.test(state)) continue;
      const name = r.getCell(2 + offset).text.trim(); const slug = slugify(name); const key = `${state}-${slug}`;
      const entry = locations.get(key) ?? { id: zipIds.get(key) ?? key, state, stateSlug: stateSlug(state), name, slug, counties: r.getCell(3 + offset).text.split('/').map((s) => s.trim()).filter(Boolean), seasons: [], mie: Number(r.getCell(7 + offset).value) };
      entry.seasons.push({ start: date(r.getCell(4 + offset).text, fy), end: date(r.getCell(5 + offset).text, fy, true), lodging: Number(r.getCell(6 + offset).value) }); locations.set(key, entry);
    }
    for(const location of locations.values()){if(location.seasons.every(s=>s.start.endsWith('-01')&&new Date(Date.parse(s.end)+86400000).getUTCDate()===1)){location.monthlyLodging=Array.from({length:12},(_,i)=>{const point=new Date(Date.UTC(fy-1,9+i,1)).toISOString().slice(0,10);const season=location.seasons.find(s=>s.start<=point&&s.end>=point);if(!season)throw new Error('Missing monthly rate');return season.lodging;});}}
    const retrievedAt = (await stat(`${dir}/${masterFile}`)).mtime.toISOString();
    const meta = { dataset: 'per-diem', period, effectiveFrom: `${fy - 1}-10-01`, effectiveTo: `${fy}-09-30`, sourceUrls: [masterFile, zipFile].map((name) => `https://www.gsa.gov/system/files/${name}`), retrievedAt };
    const result = perDiemSchema.parse({ meta, standard: { lodging: Number(sheet.getRow(3).getCell(6 + offset).value), mie: Number(sheet.getRow(3).getCell(7 + offset).value) }, locations: [...locations.values()].map((location) => ({ ...location, seasons: location.seasons.sort((a,b) => a.start.localeCompare(b.start)) })).sort((a,b) => `${a.state}-${a.slug}`.localeCompare(`${b.state}-${b.slug}`)) });
    const zips: Record<string, string> = {};
    for (let row = 2; row <= zipSheet.rowCount; row++) {
      const r = zipSheet.getRow(row); const zip = r.getCell(6).text.padStart(5, '0'); if (!/^\d{5}$/.test(zip)) throw new Error(`Bad ZIP ${zip}`);
      if (r.getCell(1).text === '0') { zips[zip] = 'standard'; continue; }
      const key = `${r.getCell(5).text}-${slugify(r.getCell(2).text)}`; const location = locations.get(key) ?? [...locations.values()].find((entry) => entry.id === r.getCell(1).text);
      if (!location) throw new Error(`Unmapped ZIP locality ${key}`); zips[zip] = location.id;
    }
    for (const location of result.locations) { for (let d = new Date(meta.effectiveFrom + 'T00:00:00Z'); d.toISOString().slice(0,10) <= meta.effectiveTo; d.setUTCDate(d.getUTCDate()+1)) { const day=d.toISOString().slice(0,10); if (location.seasons.filter((season)=>season.start<=day && season.end>=day).length!==1) throw new Error(`Season gap or overlap: ${location.name} ${day}`); } }
    const mieRows = [[68,16,19,28,5,51],[74,18,20,31,5,55.5],[80,20,22,33,5,60],[86,22,23,36,5,64.5],[92,23,26,38,5,69]].map(([mie,breakfast,lunch,dinner,incidentals,firstLast])=>({mie,breakfast,lunch,dinner,incidentals,firstLast}));
    for (const location of result.locations) if (!mieRows.some((entry)=>entry.mie===location.mie)) throw new Error(`Missing M&IE: ${location.mie}`);
    for (const folder of ['per-diem','per-diem-zip']) await mkdir(`data/generated/${folder}`, {recursive:true});
    await writeFile(`data/generated/per-diem/${period}.json`, JSON.stringify(result,null,2)+'\n');
    await writeFile(`data/generated/per-diem-zip/${period}.json`, JSON.stringify({ meta:{...meta,dataset:'per-diem-zip'}, zips:Object.fromEntries(Object.entries(zips).sort()) },null,2)+'\n');
    await writeFile(`data/manual/per-diem-mie/${period}.json`,JSON.stringify({meta:{...meta,dataset:'per-diem-mie',sourceUrls:['https://www.gsa.gov/travel/plan-a-trip/per-diem-rates/mie-breakdowns']},rates:mieRows},null,2)+'\n');
    console.log(`${period}: ${result.locations.length} locations, ${Object.keys(zips).length} ZIPs`);
  }
}


