# Official downloads still required

The GSA, VA compensation, and GI Bill downloads succeeded. DoD/DFAS rate downloads returned HTTP 403 in this environment. BAH lookup, basic pay charts, BAS tables, and automatic PCS entitlement calculations remain incomplete. Their live planning tools accept verified user-entered amounts.

Obtain files from these exact official source pages and save them unchanged:

| Official source URL | Required file | Target directory |
|---|---|---|
| https://militarypay.defense.gov/Pay/Basic-Allowance-for-Housing/BAH-Rate-Lookup | Published all-locations/all-grades BAH ZIP archive, 2025 and 2026; its ZIP-to-MHA source | `data/raw/bah/2025/` and `data/raw/bah/2026/` |
| https://www.dfas.mil/militarymembers/payentitlements/Pay-Tables/ | Published 2025 and 2026 enlisted, warrant, officer, and prior-enlisted officer basic-pay PDFs | `data/raw/dfas-pay/2025/` and `data/raw/dfas-pay/2026/` |
| https://militarypay.defense.gov/Pay/Allowances/BAS.aspx | Published BAS table or HTML snapshot | `data/raw/bas/2026/` |
| https://www.travel.dod.mil/Portals/119/Documents/DLA/DLA-2026-01-01.pdf | Official 2026 DLA PDF | `data/raw/pcs/2026/DLA-2026-01-01.pdf` |
| https://www.travel.dod.mil/Travel-Transportation-Rates/Mileage-Rates/ | Official current and earlier 2026 MALT tables/snapshot | `data/raw/pcs/2026/mileage.html` |
| https://www.travel.dod.mil/ | Current JTR and official TLE, household-goods weight, and PPM rules linked by the publisher | `data/raw/pcs/2026/` |

Source pages above are verified publishers. Do not guess archive download URLs; use the download links the publisher supplies. Inspect all files before writing parsers, add source/effective/retrieved metadata, and independently verify tables. Automated income-tax calculation also needs IRS and SSA annual datasets; the current pay tool uses entered deductions instead.

