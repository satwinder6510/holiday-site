/** Convert a local JPG/JPEG image path to WebP */
export function webpUrl(path: string): string {
  if (path.startsWith('/images/') && /\.jpe?g$/i.test(path)) {
    return path.replace(/\.jpe?g$/i, '.webp');
  }
  return path;
}
