import { notFound } from "next/navigation";

import { IncomingFriendRequest } from "@/types/pusher";
import { fetchRedis } from "@/lib/redis";
import { getUser } from "@/lib/user";
import FriendRequestsPage from "@/components/friend-requests";

export default async function RequestsPage() {
  const user = await getUser();

  if (!user) return notFound();

  const incomingSenderIds = (await fetchRedis(
    "smembers",
    `user:${user.id}:incoming_friend_requests`
  )) as string[];

  const incomingSenders: IncomingFriendRequest[] = await Promise.all(
    incomingSenderIds.map(async (id) => {
      const { id: senderId, email: senderEmail } = JSON.parse(
        await fetchRedis("get", `user:${id}`)
      ) as User;

      return { senderId, senderEmail };
    })
  );

  return (
    <main className="pt-8">
      <h1 className="mb-8 text-5xl font-bold">Add a Friend</h1>

      <div className="flex flex-col gap-4">
        <FriendRequestsPage
          sessionID={user.id}
          incomingFriendRequests={incomingSenders}
        />
      </div>
    </main>
  );
}
