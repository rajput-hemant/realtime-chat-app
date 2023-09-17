import { getServerSession } from "next-auth";

import { authOptions } from "./auth";

/**
 * Gets the current user from the session
 *
 * @returns The current user
 */
export async function getUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}
