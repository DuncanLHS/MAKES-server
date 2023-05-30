import { type User } from "next-auth";
const guildId = "1071217231515615282"; //TODO: Move guild id to db
import type { APIGuild, APIGuildMember, APIRole } from "discord-api-types/v10";
import { type Account } from "@prisma/client";
import { prisma } from "prisma/db";

const discordApiBaseUrl = "https://discord.com/api";

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
        `${discordApiBaseUrl}/guilds/${guildId}/members/${providerAccountId}`,
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

export const getServerRoles = async () => {
  //https://discord.com/developers/docs/topics/permissions#role-object
  //https://discord.com/developers/docs/resources/guild#get-guild-roles

  try {
    return await fetch(`${discordApiBaseUrl}/guilds/${guildId}/roles`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN as string}`,
      },
    })
      .then((res) => res.json())
      .then((data: APIRole[]) => {
        return data;
      });
  } catch (error) {
    console.error(error);
  }
};

export const getRoleDetails = async (
  roleIds: string[]
): Promise<APIRole[] | undefined> => {
  //https://discord.com/developers/docs/topics/permissions#role-object
  //https://discord.com/developers/docs/resources/guild#get-guild-role

  const serverRoles = await getServerRoles();
  if (!serverRoles) return undefined;
  const roles = serverRoles.filter((role) => roleIds.includes(role.id));
  return roles;
};

export const getGuilds = async () => {
  //https://discord.com/developers/docs/resources/user#get-current-user-guilds

  try {
    return await fetch(`${discordApiBaseUrl}/users/@me/guilds`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN as string}`,
      },
    })
      .then((res) => res.json())
      .then((data: APIGuild[]) => {
        return data;
      });
  } catch (error) {
    console.error(error);
  }
};
