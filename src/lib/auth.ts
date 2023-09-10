import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { db } from "./db";
import { env } from "./env.mjs";

export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      const dbUser: User | null = await db.get(`user:${token.id}`);

      if (!dbUser) {
        token.id = user.id;
        return token;
      }

      const { id, name, email, image: picture } = dbUser;

      return { id, name, email, picture };
    },

    session: async ({ session, token }) => {
      // if (token) {
      //   session.user.id = token.id;
      //   session.user.name = token.name;
      //   session.user.email = token.email;
      //   session.user.image = token.picture;
      // }

      if (token) {
        const { id, name, email, picture: image } = token;
        session.user = { id, name, email, image };
      }

      return session;
    },

    redirect: () => {
      return "/dashboard";
    },
  },
};
