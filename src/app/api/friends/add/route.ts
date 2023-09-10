import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { fetchRedis } from "@/lib/redis";
import { addFriendValidator } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email } = addFriendValidator.parse(body);

    /* This doesn't work as expected due to caching issues */
    // const response = await fetch(
    //   `${env.UPSTASH_REDIS_REST_URL}/get/user:email${email}`,
    //   {
    //     headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}` },
    //     cache: "no-store",
    //   }
    // );

    // const { result: id } = (await response.json()) as { result: string | null };

    const id = (await fetchRedis("get", `user:email:${email}`)) as
      | string
      | null;

    /* Check if user exists */
    if (!id) {
      return new Response("User not found", { status: 404 });
    }

    const session = await getServerSession(authOptions);

    /* Check if user is authenticated */
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    /* Check if user is trying to add themselves */
    if (id === session.user.id) {
      return new Response("You cannot add yourself as a friend", {
        status: 400,
      });
    }

    /* Check if user is already added */
    const isAlreadyAdded = (await fetchRedis(
      "sismember",
      `user:${id}:incoming_friend_requests`,
      session.user.id
    )) as boolean;

    if (isAlreadyAdded) {
      return new Response("User is already added", { status: 400 });
    }

    /* Check if user is already a friend */
    const isAlreadyFriend = (await fetchRedis(
      "sismember",
      `user:${id}:friends`,
      session.user.id
    )) as boolean;

    if (isAlreadyFriend) {
      return new Response("User is already a friend", { status: 400 });
    }

    /* Send Add friend request */
    db.sadd(`user:${id}:incoming_friend_requests`, session.user.id);

    return new Response("Friend request sent!");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }

    return new Response("Invalid request", { status: 400 });
  }
}
