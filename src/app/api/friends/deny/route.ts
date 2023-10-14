import { z } from "zod";

import { db } from "@/lib/db";
import { getUser } from "@/lib/user";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const session = await getUser();

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id: idToDeny } = z.object({ id: z.string() }).parse(body);

    // remove the friend request from the user who sent it
    await db.srem(`user:${session.id}:incoming_friend_requests`, idToDeny);

    return new Response("OK");
  } catch (error) {
    console.error(error);

    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }

    return new Response("Invalid request", { status: 400 });
  }
}
