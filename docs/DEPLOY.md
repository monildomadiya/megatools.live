# Deployment

Configuration files are prepared only. No server was contacted. The production domain is not deployed from this workspace.

1. Provision an Ubuntu DigitalOcean droplet, configure SSH access and firewall ports 22, 80, 443, and point DNS A records for `@` and `www` to its public address. Install Nginx and Certbot, Node 22 LTS, Corepack, and PM2. Confirm `node -v` is at least 20.9; Node 22 is the CI target. Run `corepack enable`.
2. Configure a read-only repository deploy key on the server, verify the GitHub SSH host key, and clone the repository into `/var/www/megatools.live`. No repository remote has been configured in this workspace yet.
3. Copy `.env.example` to `.env.production`, set `NEXT_PUBLIC_SITE_URL=https://megatools.live` and a real `CONTACT_EMAIL`. Keep ads disabled until approval. Optional analytics, Search Console, AdSense client, and manual slot IDs are build-time values; rebuild after changing them. Never commit this file.
4. Check `ss -ltnp | grep 3012` and confirm the port is free. Run `pnpm install --frozen-lockfile`, `pnpm data:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `NODE_OPTIONS=--max-old-space-size=1536 pnpm build`.
5. Run `pm2 start deploy/ecosystem.config.cjs --only megatools_live`, `pm2 save`, and follow the output from `pm2 startup`. Check `curl -I http://127.0.0.1:3012/`.
6. Copy `deploy/nginx/megatools.live.conf` into `/etc/nginx/sites-available/`, enable its symlink in `sites-enabled`, and run `sudo nginx -t` before reload. Run `sudo certbot --nginx -d megatools.live -d www.megatools.live`. Confirm HTTP and www redirect to the HTTPS apex. Verify certificate renewal.
7. Add GitHub repository secrets `DO_HOST`, `DO_USER`, and `DO_SSH_KEY`. Use a limited deployment account that owns the app checkout and PM2 process. The deployment workflow waits for successful main-branch CI and checks that its commit is still the main tip before pulling. Do not give untrusted pull requests access to deployment secrets.

Verify every tool, unknown-route 404, ZIP API, all six section sitemaps in STATUS.md, canonical URLs, `robots.txt`, and `ads.txt`. Import blocked official datasets before claiming complete official coverage. Configure Google's CMP in AdSense Privacy & messaging before enabling ads.

Rollback: record the previous deployed SHA before updating. On failure, select that reviewed SHA, run `git checkout --detach <previous-sha>`, reinstall with the lockfile, rebuild, and reload PM2. Check the site before returning the checkout to main. Back up `.env.production` separately. `pm2 logs megatools_live` and Nginx error logs provide diagnostics.

On a low-memory droplet, build on a compatible Linux Node 22 runner and rsync the resulting `.next`, `public`, package files, and runtime dependencies instead. Preserve the server environment file; build with the intended public environment values. This alternative is not configured by the supplied workflow.

Google Analytics stream: G-LL4CZRXQJ7 (megatools.live). The deployment workflow supplies this public measurement ID during the production build. Manual builds use the code default G-LL4CZRXQJ7; NEXT_PUBLIC_GA_ID can optionally override it. The root layout uses @next/third-parties/google once for all pages. Confirm page views in Analytics Realtime after deployment; calculator inputs are never sent through custom analytics events.


Render Analytics: the root layout defaults to public measurement ID G-LL4CZRXQJ7 in code. No Render environment variable is required. NEXT_PUBLIC_GA_ID is an optional override. Deploy the updated commit for the default to take effect.


