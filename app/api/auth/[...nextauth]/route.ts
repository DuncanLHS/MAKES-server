import { type GetServerSidePropsContext } from "next";
import NextAuth, {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "@/env.mjs";
import { prisma } from "prisma/db";
import { signOut } from "next-auth/react";
import { getAccount, getMember } from "@/lib/discord";

const memberRoleIds = ["1071217231536599133", "1071217231536599132"]; //TODO: Move member role ids to db

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      roles?: string[];
      nick?: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    signIn: async ({ account }) => {
      console.log("session callback");
      const member = account
        ? await getMember(account.providerAccountId)
        : null;
      if (!member) {
        return false; //TODO: Redirect to error page (not a member)
      }
      const roles = member.roles;

      if (roles && memberRoleIds.some((role) => roles.includes(role))) {
        return true;
      }

      return false; //TODO: Redirect to error page (doesn't hold member role)
    },
    session: async ({ session, user }) => {
      console.log("session callback");
      const account = await getAccount(user);
      const member = account
        ? await getMember(account.providerAccountId)
        : null;
      if (!member) {
        await signOut({ callbackUrl: "/" });
      }
      const roles = member?.roles;
      const nick = member?.nick;
      if (!roles || !memberRoleIds.some((role) => roles.includes(role))) {
        await signOut({ callbackUrl: "/" });
      }

      session.user = {
        ...session.user,
        id: user.id,
        roles: roles ?? undefined,
        nick: nick ?? undefined,
      };
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
      checks: ["none"],
      authorization: {
        params: {
          scope: "identify email guilds guilds.members.read",
        },
      },
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
