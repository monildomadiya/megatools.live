# Task 1 review

Title: feat: layout, UI kit and trust pages

Adds the shared MegaTools layout, responsive keyboard-accessible navigation, route registry, reusable UI and tool fields, provenance components, and reserved advertisement slots. Publishes the home directory and seven static trust pages with a shared newest-first updates feed and a custom 404.

All unbuilt tools remain marked Coming soon. Their navigation links resolve to home-page cards until the tool routes ship. No rates are invented or displayed.

Sources: no rate datasets imported. Source-directory URLs come from AGENTS.md section 6. Privacy references https://policies.google.com/technologies/partner-sites and https://support.google.com/adsense/answer/13554116.

Manual actions: set CONTACT_EMAIL before launch; the contact page explicitly identifies the fallback as an unmonitored placeholder. Configure a Git remote before creating a PR. Configure Google Privacy & messaging before enabling ads in a later task.

Task 1 specifically defers the AdSense script despite the general AGENTS.md requirement to include it when ads are enabled. AdSlot only reserves space for now. Full metadata, JSON-LD, robots and sitemap support follow in Task 2.

Validation: lint, typecheck, 5 unit tests, and production build passed on local Node 24 (CI targets Node 22). All pages statically generated. HTTP checks passed for all pages and custom 404. Mobile and desktop visual review passed; mobile Enter/Escape focus behavior, skip link, and table containment verified; no browser errors.

