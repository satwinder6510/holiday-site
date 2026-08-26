#!/usr/bin/env bash
set -eu

PROJECT_DIR="/Users/admin/holiday-site"
PROJECT_NAME="holiday-site"
ACCOUNT_ID="30ceb1f7e533bfb798699af40a2bcaca"
LIVE_URL="https://holidays.flightsandpackages.com"

# 1. Verify we're in the right directory
if [ "$(pwd)" != "$PROJECT_DIR" ]; then
  echo "ERROR: Must run from $PROJECT_DIR (currently in $(pwd))"
  echo "  Run: cd $PROJECT_DIR && ./deploy.sh"
  exit 1
fi

# 2. Verify this IS the holiday-site project (not admin)
if [ ! -f "astro.config.mjs" ]; then
  echo "ERROR: No astro.config.mjs found — this is not the holiday-site project"
  exit 1
fi

if ! grep -q '"holiday-site"' package.json 2>/dev/null; then
  echo "ERROR: package.json name is not 'holiday-site' — wrong project"
  exit 1
fi

# 3. Refresh city taxes from D1 (single source of truth: city_taxes table,
# shared with the admin quote tool). Fails the deploy if D1 is unreachable.
echo "Syncing city taxes from D1..."
node scripts/sync-city-taxes.mjs
echo ""

# 3a. Refresh the blog from D1 (same rule: blog_posts is the single source of
# truth, shared with the admin blog editor). Added 2026-08-21 — without it the
# site served a snapshot taken on 17 July, so admin edits never appeared and a
# database repair changed nothing on the site. Warns about any blog image still
# hosted on someone else's server; that is how 133 pictures broke at once.
echo "Syncing blog posts from D1..."
node scripts/sync-blogs.mjs
echo ""

# 3c. Refresh the river-cruise catalogue from D1. Same rule again: the export
# was last run by hand on 29 June and by late August the site sold 18 cruises
# with no sailings and hid 8 that were priced. Fails the deploy if D1 is down.
echo "Exporting river cruises from D1..."
(cd /Users/admin/holiday-admin-api && npx tsx scripts/export-cruises.ts)
echo ""

# 3b. Build
echo "Building holiday-site..."
npm run build
echo ""

# 4. Verify dist/ contains Astro output, NOT React SPA
# Homepage is SSR (no static index.html), so check the contact page instead
CHECK_FILE="dist/contact/index.html"
if grep -q "Flights & Packages Admin" "$CHECK_FILE" 2>/dev/null; then
  echo "ERROR: dist/ contains admin SPA content — ABORTING"
  echo "  The dist/ directory has the wrong build output."
  exit 1
fi

if ! grep -q "Flights and Packages" "$CHECK_FILE" 2>/dev/null; then
  echo "ERROR: dist/ doesn't look like the holiday site — ABORTING"
  exit 1
fi

echo "Build verified: dist/ contains holiday-site content"

# 5. Deploy
echo "Deploying to Cloudflare Pages ($PROJECT_NAME)..."
CLOUDFLARE_ACCOUNT_ID=$ACCOUNT_ID npx wrangler pages deploy dist/ --project-name=$PROJECT_NAME

# 6. Smoke test (wait for propagation)
echo ""
echo "Running smoke test..."
sleep 5
RESPONSE=$(curl -s "$LIVE_URL/" | head -5)
if echo "$RESPONSE" | grep -q "Flights and Packages"; then
  echo "PASS: Live site is serving holiday-site content"
elif echo "$RESPONSE" | grep -q "Flights & Packages Admin"; then
  echo "FAIL: Live site is serving ADMIN content — deployment may have gone wrong"
  exit 1
else
  echo "WARN: Could not verify live site content (may need more propagation time)"
fi

echo ""
echo "Deploy complete."
