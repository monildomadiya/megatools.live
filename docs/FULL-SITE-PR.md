# feat: MegaTools calculators and official per diem/VA data pages

Replace every Coming soon navigation card with a working tool page. GSA ZIP/city search and nightly trip estimates use FY2026/FY2027 data; VA rating/compensation and GI Bill tools use published tables. Add High-3/BRS comparison, military time conversion, generated state/locality/hour pages, provenance, split sitemaps, and deployment/rollover documentation.

BAH, basic pay, BAS, and PCS downloads returned HTTP 403. Their available planning tools use verified entered amounts. Automated rate tables and entitlement calculations remain incomplete; see DATA-BLOCKERS.md. Retirement uses manual High-3 and GI Bill campus housing uses entered official BAH. This expanded scope follows the user's request to build the entire website; no repository remote or PR exists yet.

Sources touched:
- https://www.gsa.gov/travel/plan-a-trip/per-diem-rates/per-diem-files
- https://www.gsa.gov/travel/plan-a-trip/per-diem-rates/mie-breakdowns
- https://www.va.gov/disability/compensation-rates/veteran-rates/
- https://www.ecfr.gov/current/title-38/chapter-I/part-4/subpart-A/section-4.25
- https://www.ecfr.gov/current/title-38/chapter-I/part-4/subpart-A/section-4.26
- https://www.va.gov/education/benefit-rates/post-9-11-gi-bill-rates/
- https://militarypay.defense.gov/Pay/Retirement/BlendedRetirement.aspx
- https://www.time.gov/

Validation: lint, strict typecheck, 52 unit tests, all JSON schema checks, stable importer hashes, production build, 400 public static endpoint checks, ZIP API validation, and mobile browser calculations. See STATUS.md for page counts and limits. Sources remain unchanged in data/raw; large ZIP mappings stay server-side.

Manual launch steps: obtain blocked official data, configure a real contact email and repository remote, provision the droplet/DNS/GitHub SSH secrets using DEPLOY.md, verify Search Console, and configure approved AdSense IDs/CMP only when ready. Ads and analytics default off. Live production performance and ad verification are still pending.
