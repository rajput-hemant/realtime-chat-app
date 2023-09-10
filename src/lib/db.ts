import { Redis } from "@upstash/redis";

import { env } from "@/lib/env.mjs";

export const db = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});
