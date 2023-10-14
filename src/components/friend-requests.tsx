"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, UserPlus, X } from "lucide-react";

import { IncomingFriendRequest } from "@/types/pusher";

type FriendRequestsPageProps = {
  incomingFriendRequests: IncomingFriendRequest[];
  sessionID: string;
};

export default function FriendRequestsPage({
  incomingFriendRequests,
  sessionID,
}: FriendRequestsPageProps) {
  const router = useRouter();

  const [friendReq, setFriendReq] = useState(incomingFriendRequests);

  async function acceptFriendRequest(id: string) {
    await fetch(`/api/friends/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setFriendReq((prev) => prev.filter(({ senderId }) => senderId !== id));

    router.refresh();
  }

  async function denyFriendRequest(id: string) {
    await fetch(`/api/friends/deny`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setFriendReq((prev) => prev.filter(({ senderId }) => senderId !== id));

    router.refresh();
  }

  return (
    <>
      {friendReq.length === 0 ? (
        <p className="text-sm text-zinc-500">Nothing to show here...</p>
      ) : (
        friendReq.map(({ senderId, senderEmail }) => (
          <div key={senderId} className="flex items-center gap-4">
            <UserPlus className="h-6 w-6" />

            <p className="text-lg font-medium">{senderEmail}</p>

            <button
              aria-label="accept friend"
              onClick={() => acceptFriendRequest(senderId)}
              className="grid h-8 w-8 place-items-center rounded-full bg-indigo-600 transition hover:bg-indigo-700 hover:shadow-md"
            >
              <Check className="h-3/4 w-3/4 font-semibold text-secondary" />
            </button>

            <button
              aria-label="deny friend"
              onClick={() => denyFriendRequest(senderId)}
              className="grid h-8 w-8 place-items-center rounded-full bg-red-600 transition hover:bg-red-700 hover:shadow-md"
            >
              <X className="h-3/4 w-3/4 font-semibold text-secondary" />
            </button>
          </div>
        ))
      )}
    </>
  );
}
