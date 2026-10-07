import { importVa } from './va';
import { importPerDiem } from './per-diem';
type Importer = { name: string; run: () => Promise<void> };
const importers: Importer[] = [{ name: 'GSA per diem', run: importPerDiem }, { name: 'VA compensation', run: importVa }];
async function main() {
  for (const importer of importers) {
    console.log(`Importing ${importer.name}`);
    await importer.run();
  }
  console.log(`Completed ${importers.length} importers.`);
}
main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });


