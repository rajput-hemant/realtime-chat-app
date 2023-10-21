"use client";

import { useRef, useState } from "react";
import { Session } from "next-auth";

import { cn } from "@/lib/utils";
import { type Message } from "@/lib/validations";

type Props = {
  initialMessages: Message[];
  userId: string;
};

const Messages = ({ initialMessages, userId }: Props) => {
  const scrollDownRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);

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
        const isCurrentUser = msg.senderId === userId;
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
                    {msg.timestamp}
                  </span>
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
