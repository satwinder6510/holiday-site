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

# 3. Build
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
