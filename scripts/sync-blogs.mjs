#!/usr/bin/env node
/**
 * Regenerate src/data/blog-export.json from the blog_posts table in D1
 * (holiday-flights-db) — the same table the admin blog editor writes.
 * Run automatically by deploy.sh before the build; can be run standalone:
 *   node scripts/sync-blogs.mjs
 * Requires wrangler authed on the Flights & Packages Cloudflare account.
 *
 * WHY THIS EXISTS (2026-08-21). The public blog builds from this JSON, NOT
 * from D1 — and nothing kept the two in step. The snapshot sat untouched from
 * 17 July, so every edit made in the admin since then was invisible on the
 * site, and repairing 133 broken images in the database changed nothing until
 * the file was repaired separately. Same shape as sync-city-taxes.mjs, for the
 * same reason: one source of truth, refreshed at deploy time.
 *
 * The file stays committed on purpose. A content change then shows up as a git
 * diff you can read before it ships, and the site still builds when the API or
 * D1 is unreachable.
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const target = join(here, '..', 'src', 'data', 'blog-export.json');

// Published only — drafts are unfinished work and must never reach the site.
const SQL =
  'SELECT id, title, slug, featured_image, excerpt, meta_title, meta_description, ' +
  'content, author, destination, is_published, published_at, created_at, updated_at ' +
  "FROM blog_posts WHERE is_published = 1 ORDER BY id";

const out = execFileSync(
  'npx',
  ['wrangler', 'd1', 'execute', 'holiday-flights-db', '--remote', '--json', '--command', SQL],
  {
    cwd: join(here, '..', '..', 'holiday-admin-api'),
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024, // the blog is ~1.3MB of HTML and grows
  },
);
const rows = JSON.parse(out)[0].results;

// A truncated read must never overwrite the site's content. The previous file
// is the yardstick: a big drop means the query or the auth went wrong, not
// that the owner deleted a hundred posts.
const previous = existsSync(target) ? JSON.parse(readFileSync(target, 'utf8')) : null;
const floor = previous?.posts?.length ? Math.floor(previous.posts.length * 0.8) : 50;
if (!Array.isArray(rows) || rows.length < floor) {
  throw new Error(
    `blog_posts returned ${rows?.length ?? 0} published posts, expected at least ${floor} — refusing to overwrite the site's blog.`,
  );
}

// camelCase to match what src/data/blogs.ts already maps.
const posts = rows.map((r) => ({
  id: String(r.id),
  title: r.title,
  slug: r.slug,
  featuredImage: r.featured_image,
  excerpt: r.excerpt,
  metaTitle: r.meta_title,
  metaDescription: r.meta_description,
  content: r.content,
  author: r.author,
  destination: r.destination,
  isPublished: !!r.is_published,
  publishedAt: r.published_at,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
}));

// Borrowed images are how the last outage happened: 116 posts pointed at
// citiesandbeaches.com, that company's servers went away, and every picture
// broke at once. Warn loudly rather than fail — content is the owner's call,
// but nobody should be able to say they were not told.
const EXTERNAL_IMG = /<img\b[^>]*src="https?:\/\/([^/"]+)/gi;
const OWN_HOSTS = /(^|\.)(flightsandpackages\.com|holiday-site\.pages\.dev)$/i;
const borrowed = new Map();
for (const p of posts) {
  for (const m of String(p.content ?? '').matchAll(EXTERNAL_IMG)) {
    const host = m[1].toLowerCase();
    if (OWN_HOSTS.test(host)) continue;
    if (!borrowed.has(host)) borrowed.set(host, new Set());
    borrowed.get(host).add(p.slug);
  }
}
if (borrowed.size) {
  console.warn('\n⚠ Blog images hosted on OTHER PEOPLE\'S servers — these break when that host does:');
  for (const [host, slugs] of [...borrowed].sort((a, b) => b[1].size - a[1].size)) {
    console.warn(`   ${host} — ${slugs.size} post${slugs.size === 1 ? '' : 's'} (e.g. ${[...slugs][0]})`);
  }
  console.warn('   Rehost them under /objects/images or R2 before that host disappears.\n');
}

writeFileSync(
  target,
  JSON.stringify({ exportedAt: new Date().toISOString(), totalPosts: posts.length, posts }, null, 2) + '\n',
);
console.log(`blog-export.json regenerated from D1: ${posts.length} published posts`);
