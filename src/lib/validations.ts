import { z } from "zod";

export const addFriendValidator = z.object({
  email: z.string().email(),
});

export const messageValidator = z.object({
  id: z.string(),
  senderId: z.string(),
  text: z.string(),
  timestamp: z.number(),
});

export const messageListValidator = z.array(messageValidator);

export type Message = z.infer<typeof messageValidator>;
