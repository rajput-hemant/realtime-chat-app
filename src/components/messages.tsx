"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { pusherClient } from "@/lib/pusher.client";
import { cn, formatPusherKey } from "@/lib/utils";
import { type Message } from "@/lib/validations";

type Props = {
  initialMessages: Message[];
  chatId: string;
  user: User;
  chatPartner: User;
};

const Messages = ({ initialMessages, chatId, user, chatPartner }: Props) => {
  const scrollDownRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  useEffect(() => {
    // subscribe to incoming messages
    pusherClient.subscribe(formatPusherKey(`chat:${chatId}`));

    function messageHandler(message: Message) {
      setMessages((prev) => [message, ...prev]);
    }

    // listen for incoming messages
    pusherClient.bind("incoming-messages", messageHandler);

    return () => {
      pusherClient.unsubscribe(formatPusherKey(`chat:${chatId}`));

      pusherClient.unbind("incoming-messages", messageHandler);
    };
  }, [chatId]);

  return (
    <div
      id="messages"
      className={cn(
        "flex h-full flex-1 flex-col-reverse gap-4 overflow-y-auto p-3",
        // check @styles/globals.css
        "scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-1 scrolling-touch"
      )}
    >
      <div ref={scrollDownRef} />

      {messages.map((msg, i) => {
        const isCurrentUser = msg.senderId === user.id;
        const hasNextMssgFromSameUser =
          messages[i - 1]?.senderId === messages[i].senderId;

        return (
          <div key={`${msg.id}-${msg.timestamp}`}>
            <div
              className={cn("flex items-end", isCurrentUser && "justify-end")}
            >
              <div
                className={cn("mx-2 flex max-w-xs flex-col space-y-2", {
                  "order-1 items-end": isCurrentUser,
                  "order-2 items-start": !isCurrentUser,
                })}
              >
                <span
                  className={cn("inline-block rounded-lg px-4 py-2", {
                    "bg-indigo-600 text-white": isCurrentUser,
                    "bg-gray-200 text-gray-900": !isCurrentUser,
                    "rounded-br-none":
                      !hasNextMssgFromSameUser && isCurrentUser,
                    "rounded-bl-none":
                      !hasNextMssgFromSameUser && !isCurrentUser,
                  })}
                >
                  {msg.text}{" "}
                  <span className="ml-2 text-xs text-gray-400">
                    {new Date(msg.timestamp).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                    })}
                  </span>
                </span>
              </div>

              <div
                className={cn("relative h-6 w-6", {
                  "order-2": isCurrentUser,
                  "order-1": !isCurrentUser,
                  invisible: hasNextMssgFromSameUser,
                })}
              >
                <Image
                  src={isCurrentUser ? user.image : chatPartner.image}
                  alt={`${
                    isCurrentUser ? user.name : chatPartner.name
                  } Profile Picture`}
                  fill
                  referrerPolicy="no-referrer"
                  className="rounded-full"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
