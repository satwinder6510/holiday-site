/// <reference path="../.astro/types.d.ts" />

type Hyperdrive = {
  connectionString: string;
};

type Runtime = import('@astrojs/cloudflare').Runtime<{
  HYPERDRIVE: Hyperdrive;
  PRIVYR_WEBHOOK_URL: string;
}>;

declare namespace App {
  interface Locals extends Runtime {}
}
