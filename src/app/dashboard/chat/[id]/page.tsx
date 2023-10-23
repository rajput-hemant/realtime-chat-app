import Image from "next/image";
import { notFound } from "next/navigation";

import { db } from "@/lib/db";
import { fetchRedis } from "@/lib/redis";
import { getUser } from "@/lib/user";
import { messageListValidator } from "@/lib/validations";
import ChatInput from "@/components/chat-input";
import Messages from "@/components/messages";

type Props = {
  params: {
    id: string;
  };
};

async function getChatMessages(chatId: string) {
  try {
    const results: string[] = await fetchRedis(
      "zrange",
      `chat:${chatId}:messages`,
      0, // from
      -1 // to (end)
    );

    const dbMessages = results.map((mssg) => JSON.parse(mssg) as Message);

    return messageListValidator.parse(dbMessages.reverse());
  } catch (e) {
    notFound();
  }
}

const Chat = async ({ params: { id } }: Props) => {
  const user = await getUser();

  if (!user) notFound();

  const [user1, user2] = id.split("--");

  if (user1 !== user.id && user2 !== user.id) notFound();

  const partnerId = user1 === user.id ? user2 : user1;

  const chatPartner = (await db.get(`user:${partnerId}`)) as User;

  const initialMessages = await getChatMessages(id);

  return (
    <div className="flex h-full flex-1 flex-col justify-between">
      <div className="flex justify-between border-b-2 border-border py-3 sm:items-center">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <div className="relative h-8 w-8 sm:h-12 sm:w-12">
              <Image
                src={chatPartner.image}
                alt={chatPartner.name}
                fill
                referrerPolicy="no-referrer"
                className="rounded-full"
              />
            </div>
          </div>

          <div className="flex flex-col leading-tight">
            <div className="flex items-center text-xl">
              <span className="mr-3 font-semibold text-gray-700">
                {chatPartner.name}
              </span>
            </div>

            <span className="text-sm text-gray-600">{chatPartner.email}</span>
          </div>
        </div>
      </div>

      <Messages
        initialMessages={initialMessages}
        chatId={id}
        user={user}
        chatPartner={chatPartner}
      />

      <ChatInput chatId={id} chatPartner={chatPartner} />
    </div>
  );
};

export default Chat;
