#!/usr/bin/env bash
# Convert JPG/JPEG images in public/images/ to WebP format
# Country icons: resized to 320px wide (display max 291px)
# Collection images: resized to 400px wide (display max 396px)
# All other JPGs: converted at original size
# Quality: 80 (good balance of size vs quality)

set -euo pipefail

IMAGES_DIR="$(cd "$(dirname "$0")/../public/images" && pwd)"

converted=0
skipped=0

echo "Converting images in $IMAGES_DIR to WebP..."

# Country icons — resize to 320px wide
for file in "$IMAGES_DIR"/countries/*_icon.jpg "$IMAGES_DIR"/countries/*_icon.jpeg; do
  [ -f "$file" ] || continue
  out="${file%.*}.webp"
  if [ -f "$out" ]; then
    skipped=$((skipped + 1))
    continue
  fi
  cwebp -q 80 -resize 320 0 "$file" -o "$out" -quiet
  converted=$((converted + 1))
done

# Collection images — resize to 400px wide
for file in "$IMAGES_DIR"/collections/*.jpg "$IMAGES_DIR"/collections/*.jpeg; do
  [ -f "$file" ] || continue
  out="${file%.*}.webp"
  if [ -f "$out" ]; then
    skipped=$((skipped + 1))
    continue
  fi
  cwebp -q 80 -resize 400 0 "$file" -o "$out" -quiet
  converted=$((converted + 1))
done

# Hero images — convert at original size
for file in "$IMAGES_DIR"/heroes/*.jpg "$IMAGES_DIR"/heroes/*.jpeg; do
  [ -f "$file" ] || continue
  out="${file%.*}.webp"
  if [ -f "$out" ]; then
    skipped=$((skipped + 1))
    continue
  fi
  cwebp -q 80 "$file" -o "$out" -quiet
  converted=$((converted + 1))
done

# Root-level images (about-us-middle, call-expert-background, etc.)
for file in "$IMAGES_DIR"/*.jpg "$IMAGES_DIR"/*.jpeg; do
  [ -f "$file" ] || continue
  out="${file%.*}.webp"
  if [ -f "$out" ]; then
    skipped=$((skipped + 1))
    continue
  fi
  cwebp -q 80 "$file" -o "$out" -quiet
  converted=$((converted + 1))
done

echo "Done. Converted: $converted, Skipped (already exist): $skipped"

# Show size comparison
echo ""
echo "Size comparison:"
jpg_size=$(find "$IMAGES_DIR" -name "*.jpg" -o -name "*.jpeg" | xargs du -ch 2>/dev/null | tail -1 | cut -f1)
webp_size=$(find "$IMAGES_DIR" -name "*.webp" | xargs du -ch 2>/dev/null | tail -1 | cut -f1)
echo "  JPG total: $jpg_size"
echo "  WebP total: $webp_size"
