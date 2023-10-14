"use client";

import { useState } from "react";
import Link from "next/link";
import { User } from "lucide-react";

type FriendReqSidebarProps = {
  initialUnseenReqCount: number;
  sessionID: string;
};

function FriendReqSidebar({ initialUnseenReqCount }: FriendReqSidebarProps) {
  const [unseenReqCount, setUnseenReqCount] = useState(initialUnseenReqCount);

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
