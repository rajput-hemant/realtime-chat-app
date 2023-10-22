import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    UPSTASH_REDIS_REST_URL: z.string().url(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    PUSHER_APP_ID: z.string().min(1),
    PUSHER_SECRET: z.string().min(1),
    PUSHER_CLUSTER: z.string().min(1),
    PUSHER_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_PUSHER_KEY: z.string().min(1),
    NEXT_PUBLIC_PUSHER_CLUSTER: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_PUSHER_KEY: process.env.NEXT_PUBLIC_PUSHER_KEY,
    NEXT_PUBLIC_PUSHER_CLUSTER: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  },
});
