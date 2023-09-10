import { env } from "./env.mjs";

/**
 * Fetches data from a Redis server using RESTful API commands.
 *
 * @param command The Redis command to execute `zrange`|`sismember`|`get`|`smembers`.
 * @param args Arguments to be passed to the Redis command.
 * @returns A Promise that resolves to the result of the Redis command.
 */
export async function fetchRedis(
  command: "zrange" | "sismember" | "get" | "smembers",
  ...args: (string | number)[]
) {
  const cmdUrl = `${env.UPSTASH_REDIS_REST_URL}/${command}/${args.join("/")}`;

  const response = await fetch(cmdUrl, {
    headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}` },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error executing Redis command: ${response.statusText}`);
  }

  const data = (await response.json()) as { result: any };
  return data.result;
}
