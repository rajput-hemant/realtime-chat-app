"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  friends: User[];
  userId: string;
};

const SidebarChatlist = ({ friends, userId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (pathname.includes("chat")) {
      setUnseenMessages((prev) => {
        return prev.filter((msg) => !pathname.includes(msg.senderId));
      });
    }
  }, [pathname]);

  return (
    <ul role="list" className="-mx-2 max-h-[25rem] space-y-1 overflow-y-auto">
      {friends.sort().map((friend) => {
        const unseenMessagesCount = unseenMessages.filter(
          (msg) => msg.senderId === friend.id
        ).length;

        return (
          <li key={friend.id}>
            <a
              href={`/dashboard/chat/${[userId, friend.id].sort().join("--")}`}
              className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-muted hover:text-indigo-600"
            >
              {friend.name}
              {unseenMessagesCount > 0 && (
                <span className="ml-1 rounded-full bg-indigo-500 px-2 py-1 text-xs text-secondary">
                  {unseenMessagesCount}
                </span>
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarChatlist;
