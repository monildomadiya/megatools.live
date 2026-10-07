# Official data rollover

Calendar: Aug–Sep GSA fiscal-year workbooks; Oct Social Security COLA announcements and VA tables effective Dec 1; mid-Dec BAH; Dec–Jan DFAS pay, BAS, PCS, IRS, and Social Security wage-base tables; Aug 1 GI Bill academic-year rates. PCS rates can also change midyear: verify the actual travel effective date.

Download official files unchanged into `data/raw/<source>/<period>/`. Inspect new workbook headers and sheets before changing parsers. Run `pnpm data:all`, review the generated diff, and double-check official figures. Add a dated entry to `data/manual/changelog.json` using `{date,title,description,url}`. Run `pnpm data:check`, lint, typecheck, tests, and production build. Submit a reviewed PR, then deploy and check current tool pages, sources, and sitemaps.

GSA files go into `data/raw/gsa-per-diem/FY2028/` with one master-rate XLSX and one ZIP XLSX. The importer currently recognizes FY2026 and FY2027 observed layouts; extend it deliberately for changed years, and register new JSON in the server loader. Retain old years for trips spanning fiscal boundaries.

VA HTML snapshots go into `data/raw/va-compensation/2027/source.html`; the current importer handles the inspected 2026 nine-table layout. Update the period and effective date, preserve all dependent rows, and add published spot-checks. GI Bill snapshots go into `data/raw/gi-bill/2027-2028/source.html`; transcribe and independently verify limits in a versioned manual JSON, including its BAH year.

Missing sources: see `docs/DATA-BLOCKERS.md`. Never substitute unofficial tables or guessed rates. Freshness warnings do not mean a future period is published and do not fail a build; invalid schemas do.
