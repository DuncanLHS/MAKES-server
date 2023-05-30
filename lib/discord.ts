import { type User } from "next-auth";
const guildId = "1071217231515615282"; //TODO: Move guild id to db
import type { APIGuildMember } from "discord-api-types/v10";
import { type Account } from "@prisma/client";
import { prisma } from "prisma/db";

export const getAccount = async (user: User): Promise<Account | null> => {
  const account = await prisma.account.findFirst({
    where: {
      userId: user.id,
    },
  });
  return account;
};

export const getMember = async (
  providerAccountId: string
): Promise<APIGuildMember | undefined> => {
  //https://discord.com/developers/docs/resources/guild#get-guild-member

  if (providerAccountId) {
    try {
      return await fetch(
        `https://discord.com/api/guilds/${guildId}/members/${providerAccountId}`,
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
  } else {
    return undefined;
  }
};
