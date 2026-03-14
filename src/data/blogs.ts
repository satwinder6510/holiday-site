// Data transformation layer — maps blog-export.json to template interfaces

interface RawBlog {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  featuredImage: string | null;
  author: string;
  destination: string | null;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  image: string;
  date: string;
  publishedAt: string;
  author: string;
  excerpt: string;
  tags: string[];
  content: string;
  metaTitle: string;
  metaDescription: string;
  updatedAt: string;
}

// ── Helpers ──────────────────────────────────────────────────────────

function parseAuthorField(raw: string): { author: string; date: string; tags: string[] } {
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);

  let author = '';
  let date = '';
  const tags: string[] = [];

  // Line 0 is "Posted by"
  // Line 1 is the author name
  // Line 2 is the date (DD-Mon-YYYY)
  // Remaining lines are tags (after empty lines are filtered out)
  let phase = 0; // 0=looking for author, 1=looking for date, 2=tags
  for (const line of lines) {
    if (line.toLowerCase() === 'posted by') {
      phase = 0;
      continue;
    }
    if (phase === 0) {
      // First non-"Posted by" line is the author name
      author = line;
      phase = 1;
      continue;
    }
    if (phase === 1) {
      // Date line in DD-Mon-YYYY format
      if (/^\d{2}-[A-Za-z]{3}-\d{4}$/.test(line)) {
        date = formatDate(line);
        phase = 2;
        continue;
      }
    }
    if (phase === 2) {
      // Everything after date is a tag
      tags.push(line);
    }
  }

  return { author, date, tags };
}

function formatDate(raw: string): string {
  // Convert "22-Sep-2019" to "22 September 2019"
  const months: Record<string, string> = {
    Jan: 'January', Feb: 'February', Mar: 'March', Apr: 'April',
    May: 'May', Jun: 'June', Jul: 'July', Aug: 'August',
    Sep: 'September', Oct: 'October', Nov: 'November', Dec: 'December',
  };
  const parts = raw.split('-');
  if (parts.length !== 3) return raw;
  const day = parseInt(parts[0], 10);
  const month = months[parts[1]] || parts[1];
  const year = parts[2];
  return `${day} ${month} ${year}`;
}

const FALLBACK_IMAGE = '/images/heroes/blog.jpg';

// ── Transform ────────────────────────────────────────────────────────

function transformBlog(raw: RawBlog): Blog {
  const { author, date, tags } = parseAuthorField(raw.author);

  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    image: raw.featuredImage || FALLBACK_IMAGE,
    date,
    publishedAt: raw.publishedAt || '',
    author,
    excerpt: raw.excerpt || '',
    tags,
    content: raw.content || '',
    metaTitle: raw.metaTitle || raw.title,
    metaDescription: raw.metaDescription || raw.excerpt || '',
    updatedAt: raw.updatedAt || '',
  };
}

// ── Import and export ────────────────────────────────────────────────

import rawData from './blog-export.json';

const rawBlogs = (rawData as { posts: RawBlog[] }).posts;

export const allBlogs: Blog[] = rawBlogs
  .filter(b => b.isPublished)
  .map(transformBlog);

/** Unique tags across all blogs, sorted alphabetically. */
export const blogTags: string[] = [
  ...new Set(allBlogs.flatMap(b => b.tags)),
].sort();

/** Get a single blog by slug. */
export function getBlogBySlug(slug: string): Blog | undefined {
  return allBlogs.find(b => b.slug === slug);
}
