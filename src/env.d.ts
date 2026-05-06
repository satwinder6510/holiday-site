/// <reference path="../.astro/types.d.ts" />

type Runtime = import('@astrojs/cloudflare').Runtime<{
  DB: D1Database;
  PRIVYR_WEBHOOK_URL: string;
  IMAGES: R2Bucket;
}>;

declare namespace App {
  interface Locals extends Runtime {}
}
