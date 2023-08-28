import type { APIGuildMember, APIGuild, APIRole } from "discord-api-types/v10";
import discordAPICall from "./discordAPI";
import { prisma } from "@/prisma/db";

export const userAuth = async (
  userId: string
): Promise<Map<string, ("admin" | "user")[]> | undefined> => {
  const servers = await prisma.server.findMany();
  const userAuths = new Map<string, ("admin" | "user")[]>();
  servers.map(async (server) => {
    const member = await getMember(userId, server.guildId);

    if (!member) return;
    const userAuth = new Array<"admin" | "user">();

    if (server.adminRoleIds.some((roleId) => member.roles.includes(roleId))) {
      userAuth.push("admin");
      console.log("User is admin");
    }

    if (server.userRoleIds.some((roleId) => member.roles.includes(roleId))) {
      userAuth.push("user");
      console.log("User is user");
    }
    if (userAuth.length > 0) userAuths.set(server.guildId, userAuth);
  });

  if (userAuths.size === 0) return undefined;
  return userAuths;
};

export const getMember = async (
  userId: string,
  guildId: string
): Promise<APIGuildMember | undefined> => {
  try {
    return await discordAPICall<APIGuildMember>(
      `/guilds/${guildId}/members/${userId}`,
      "GET",
      `member - ${userId}`
    );
  } catch (error) {
    console.error(error);
  }
};

export const getServerRoles = async (guildId: string) => {
  //https://discord.com/developers/docs/topics/permissions#role-object
  //https://discord.com/developers/docs/resources/guild#get-guild-roles
  try {
    return await discordAPICall<APIRole[]>(
      `/guilds/${guildId}/roles`,
      "GET",
      `guildRoles - ${guildId}`
    );
  } catch (error) {
    console.error(error);
  }
};

export const getRoleDetails = async (
  roleIds: string[],
  guildId: string
): Promise<APIRole[] | undefined> => {
  //https://discord.com/developers/docs/topics/permissions#role-object
  //https://discord.com/developers/docs/resources/guild#get-guild-role
  const serverRoles = await getServerRoles(guildId);
  if (!serverRoles) return undefined;
  const roles = serverRoles.filter((role) => roleIds.includes(role.id));
  return roles;
};

export const getGuilds = async () => {
  //https://discord.com/developers/docs/resources/user#get-current-user-guilds
  try {
    return await discordAPICall<APIGuild[]>(
      `/users/@me/guilds`,
      "GET",
      `guilds`
    );
  } catch (error) {
    console.error(error);
  }
};

export const getAllMembers = async (guildId: string) => {
  try {
    const data = await discordAPICall<APIGuildMember[]>(
      `/guilds/${guildId}/members?limit=1000`,
      "GET",
      `members - ${guildId}`
    );

    if (!data) return undefined;

    const filtered = data.filter((member) => member.user?.bot !== true);

    const sorted = filtered.sort((a, b) => {
      if (
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (a.nick?.toLowerCase() ?? a.user!.username.toLowerCase()) <
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (b.nick?.toLowerCase() ?? b.user!.username.toLowerCase())
      )
        return -1;
      else if (
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (a.nick?.toLowerCase() ?? a.user!.username.toLowerCase()) >
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (b.nick?.toLowerCase() ?? b.user!.username.toLowerCase())
      )
        return 1;
      else return 0;
    });

    return sorted;
  } catch (error) {
    console.error(error);
  }
};
export { discordAPICall };
