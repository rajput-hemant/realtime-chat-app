import { nanoid } from "nanoid";

import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher.server";
import { fetchRedis } from "@/lib/redis";
import { getUser } from "@/lib/user";
import { formatPusherKey } from "@/lib/utils";
import { Message, messageValidator } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const { chatId, text } = (await req.json()) as {
      chatId: string;
      text: string;
    };
    const user = await getUser();

    if (!user) return new Response("Unauthorized", { status: 401 });

    const [userId1, userId2] = chatId.split("--");

    if (userId1 !== user.id && userId2 !== user.id)
      return new Response("Unauthorized", { status: 401 });

    const partnerId = userId1 === user.id ? userId2 : userId1;

    const friendList = (await fetchRedis(
      "smembers",
      `user:${user.id}:friends`
    )) as string[];

    const isFriend = friendList.includes(partnerId);

    if (!isFriend) return new Response("Unauthorized", { status: 401 });

    const sender = JSON.parse(
      await fetchRedis("get", `user:${user.id}`)
    ) as User;

    const timestamp = Date.now();

    const messagePayload: Message = {
      id: nanoid(),
      senderId: user.id,
      text,
      timestamp,
    };

    const message = messageValidator.parse(messagePayload);

    // notify all connected clients
    pusherServer.trigger(
      formatPusherKey(`chat:${chatId}`),
      "incoming-messages",
      message
    );

    pusherServer.trigger(
      formatPusherKey(`user:${partnerId}:chats`),
      "new-message",
      { ...message, senderImg: sender.image, senderName: sender.name }
    );

    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    });

    return new Response("Message sent");
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }

    return new Response("Internal server error", { status: 500 });
  }
}
