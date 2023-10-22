"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User } from "lucide-react";

import { pusherClient } from "@/lib/pusher.client";
import { formatPusherKey } from "@/lib/utils";

type FriendReqSidebarProps = {
  initialUnseenReqCount: number;
  sessionID: string;
};

function FriendReqSidebar({
  initialUnseenReqCount,
  sessionID,
}: FriendReqSidebarProps) {
  const [unseenReqCount, setUnseenReqCount] = useState(initialUnseenReqCount);
  useEffect(() => {
    // subscribe to incoming friend requests
    pusherClient.subscribe(
      formatPusherKey(`user:${sessionID}:incoming_friend_request`)
    );

    function friendRequestHandler() {
      setUnseenReqCount((prev) => prev + 1);
    }

    // listen for incoming friend requests
    pusherClient.bind("incoming_friend_request", friendRequestHandler);

    return () => {
      pusherClient.unsubscribe(
        formatPusherKey(`user:${sessionID}:incoming_friend_request`)
      );

      pusherClient.unbind("incoming_friend_request", friendRequestHandler);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Link
      href="/dashboard/requests"
      className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-muted hover:text-indigo-600"
    >
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-border text-[0.625rem] font-medium text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600">
        <User className="h-4 w-4" />
      </div>

      <p className="truncate">Friend Requests</p>

      {unseenReqCount > 0 && (
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs text-secondary">
          {unseenReqCount}
        </div>
      )}
    </Link>
  );
}

export default FriendReqSidebar;
