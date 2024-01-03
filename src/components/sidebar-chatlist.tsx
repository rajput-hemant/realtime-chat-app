"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Reply } from "lucide-react";
import { toast } from "sonner";

import { pusherClient } from "@/lib/pusher.client";
import { formatPusherKey } from "@/lib/utils";

type Props = {
  friends: User[];
  userId: string;
};

type ExtendedMessage = Message & {
  senderName: string;
  senderImg: string;
};

function chatHrefConstructor(userId: string, friendId: string) {
  return `/dashboard/chat/${[userId, friendId].sort().join("--")}`;
}

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

  useEffect(() => {
    // subscribe to incoming messages
    pusherClient.subscribe(formatPusherKey(`user:${userId}:chats`));
    // subscribe to incoming friend requests
    pusherClient.subscribe(formatPusherKey(`user:${userId}:friends`));

    function chatHandler(message: ExtendedMessage) {
      const chathref = chatHrefConstructor(userId, message.senderId);

      if (pathname === chathref) return;

      const formattedText =
        message.text.length > 50
          ? `${message.text.slice(0, 50)}...`
          : message.text;

      toast(message.senderName, {
        description: formattedText,
        duration: 10000,
        action: {
          label: "Reply",
          onClick: () => router.push(chathref),
        },
      });

      setUnseenMessages((prev) => [...prev, message]);
    }

    function newFriendHandler() {
      router.refresh();
    }

    // listen for incoming messages
    pusherClient.bind("new-message", chatHandler);
    // listen for incoming friend requests
    pusherClient.bind("new-friend", newFriendHandler);

    return () => {
      pusherClient.unsubscribe(formatPusherKey(`user:${userId}:chats`));
      pusherClient.unsubscribe(formatPusherKey(`user:${userId}:friends`));

      pusherClient.unbind("new-friend", newFriendHandler);
    };
  }, [pathname, router, userId]);

  return (
    <ul role="list" className="-mx-2 max-h-[25rem] space-y-1 overflow-y-auto">
      {friends.sort().map((friend) => {
        const unseenMessagesCount = unseenMessages.filter(
          (msg) => msg.senderId === friend.id
        ).length;

        return (
          <li key={friend.id}>
            <a
              href={chatHrefConstructor(userId, friend.id)}
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
