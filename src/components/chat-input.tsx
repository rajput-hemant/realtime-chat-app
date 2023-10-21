"use client";

import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import { toast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ToastAction } from "./ui/toast";

type Props = {
  chatId: string;
  chatPartner: User;
};

const ChatInput = ({ chatId, chatPartner }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function sendMessage() {
    setIsSending(true);

    try {
      await fetch("/api/message/send", {
        method: "POST",
        body: JSON.stringify({
          chatId,
          message: input,
        }),
      });

      setInput("");
      textareaRef.current?.focus();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem sending your message.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="relative border-t p-4 sm:mb-0">
      <Textarea
        ref={textareaRef}
        rows={6}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key == "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
        placeholder={`Send message to ${chatPartner.name}...`}
      />

      <div className="absolute bottom-6 right-6 flex justify-between py-2 pl-3 pr-2">
        <Button
          type="submit"
          disabled={isSending}
          onClick={sendMessage}
          className="min-w-[5rem]"
        >
          {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Post"}
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
