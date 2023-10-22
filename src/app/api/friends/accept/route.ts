import { z } from "zod";

import { db } from "@/lib/db";
import { fetchRedis } from "@/lib/redis";
import { getUser } from "@/lib/user";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

    const session = await getUser();

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    // verify that the users are not already friends
    const areAlreadyFriends = await fetchRedis(
      "sismember",
      `user:${session.id}:friends`,
      idToAdd
    );

    if (areAlreadyFriends) {
      return new Response("Already friends", { status: 400 });
    }

    // check if the user has a friend requests
    const hasFriendRequest = await fetchRedis(
      "sismember",
      `user:${session.id}:incoming_friend_request`,
      idToAdd
    );

    if (!hasFriendRequest) {
      return new Response("No friend request", { status: 400 });
    }

    // add both users to each others friends list
    await db.sadd(`user:${session.id}:friends`, idToAdd);
    await db.sadd(`user:${idToAdd}:friends`, session.id);

    // remove the friend request from the user who sent it
    // await db.srem(`user:${idToAdd}:outbound_friend_requests`, session.id);

    await db.srem(`user:${session.id}:incoming_friend_request`, idToAdd);

    return new Response("OK");
  } catch (error) {
    console.error(error);

    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }

    return new Response("Invalid request", { status: 400 });
  }
}
