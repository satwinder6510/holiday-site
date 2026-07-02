/**
 * sanitize.ts — defang filter for HTML sourced from the DB / CMS / supplier feeds.
 *
 * This is a DEFANG FILTER, not a full HTML parser. Content authors are trusted
 * admins; this exists as defence-in-depth against a compromised admin panel or
 * a poisoned supplier feed, so injected markup can't execute on visitors.
 *
 * It strips <script>/<style> blocks, embedding/injection tags (iframe, object,
 * embed, form, link, meta), inline on*= event handlers, and neutralises
 * javascript: and data:text/html URLs in href/src attributes.
 *
 * Future work: run a parser-based sanitizer (e.g. sanitize-html or DOMPurify)
 * at content-import time instead, and keep this as a last-line safety net.
 */

export function sanitizeHtml(html: string | null | undefined): string {
  if (html == null) return '';
  let out = String(html);

  // Remove script/style blocks entirely, content included.
  out = out.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, '');
  out = out.replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, '');
  // Any stray/unclosed script or style tags left behind.
  out = out.replace(/<\/?(?:script|style)\b[^>]*>/gi, '');

  // Strip embedding/injection tags (openers and closers); inner text is kept.
  out = out.replace(/<\/?(?:iframe|object|embed|form|link|meta)\b[^>]*>/gi, '');

  // Strip inline event handlers: onclick="..."  onclick='...'  onclick=unquoted
  out = out.replace(/\son\w+\s*=\s*"[^"]*"/gi, '');
  out = out.replace(/\son\w+\s*=\s*'[^']*'/gi, '');
  out = out.replace(/\son\w+\s*=\s*[^\s>"']+/gi, '');

  // Neutralise dangerous URL schemes in href/src — replace the scheme with '#'.
  out = out.replace(/((?:href|src)\s*=\s*["']?\s*)javascript\s*:/gi, '$1#');
  out = out.replace(/((?:href|src)\s*=\s*["']?\s*)data\s*:\s*text\/html/gi, '$1#');

  return out;
}
