# Deployment

MegaTools is hosted on Render, connected to `monildomadiya/megatools.live` on `main`, as confirmed by the owner. This supersedes the original DigitalOcean hosting plan in AGENTS.md.

GitHub Actions runs application checks through `.github/workflows/ci.yml`. Render manages deployment through its existing GitHub integration. The obsolete SSH deployment workflow was removed because it attempted to connect to an unconfigured DigitalOcean host and failed with `missing server host`. No DigitalOcean SSH secrets are needed for Render.

The existing Render service is `srv-db34rrss728c73bbpqk0`. Check deployment progress and the deployed commit in that service's dashboard. Auto-deploy settings were not changed or verified from this workspace. Removing the GitHub workflow does not itself confirm a successful Render deployment. Old failed GitHub runs remain in history and should not be rerun.

## Google Analytics

The root layout includes Google Analytics once across all pages using `@next/third-parties/google`. The public measurement ID defaults to `G-LL4CZRXQJ7` in code; no Render environment variable is required. `NEXT_PUBLIC_GA_ID` remains an optional override. Deploy commit `06a883c` or a later commit to include this default. Confirm receipt in Google Analytics Realtime after deployment.

## Release verification

Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` before pushing. After Render deploys, verify the home page, calculators, ZIP lookup, unknown-route 404, and section sitemaps. Confirm the deployed commit in Render when investigating stale content.

Keep real environment files and credentials out of Git. Configure the real contact email and any optional Search Console or advertising settings separately. Ads remain disabled until approved and configured. Data coverage gaps remain documented in STATUS.md and DATA-BLOCKERS.md.

The PM2 and Nginx files under `deploy/` are legacy self-hosting examples and are not used by the current Render service.
