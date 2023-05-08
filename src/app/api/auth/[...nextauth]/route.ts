import { type GetServerSidePropsContext } from "next";
import NextAuth, {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
  type Account,
} from "next-auth";
import type { APIGuildMember } from "discord-api-types/v10";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "@/env.mjs";
import { prisma } from "prisma/db";

const guildId = "1071217231515615282"; //TODO: Move guild id to db
const memberRoleIds = ["1071217231536599133", "1071217231536599132"]; //TODO: Move member role ids to db

const getMember = async (account: Account) => {
  //https://discord.com/developers/docs/resources/guild#get-guild-member
  try {
    return await fetch(
      `https://discord.com/api/guilds/${guildId}/members/${account.providerAccountId}`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN as string}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data: APIGuildMember) => {
        return data;
      });
  } catch (error) {
    console.error(error);
  }
};

const getRoles = async (account: Account) => {
  const member = await getMember(account);
  return member ? member.roles : null;
};

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
    async signIn({ user, account, profile }) {
      if (account) {
        const roles = await getRoles(account);
        if (roles && memberRoleIds.some((role) => roles.includes(role))) {
          return true; //TODO: Redirect to error page (not allowed to sign in)
        }
      }
      return false;
    },
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "identify email guilds",
        },
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
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
