import PusherServer from "pusher";

import { env } from "./env.mjs";

export const pusherServer = new PusherServer({
  appId: env.PUSHER_APP_ID,
  key: env.PUSHER_KEY,
  secret: env.PUSHER_SECRET,
  cluster: env.PUSHER_CLUSTER,
  useTLS: true,
});
