import type {
  APIGuild,
  APIGuildMember,
  APIRole,
  RESTGetAPIGuildMembersQuery,
} from "discord-api-types/v10";

const guildId = "1071217231515615282"; //TODO: Move guild id to db
const discordApiBaseUrl = "https://discord.com/api";

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

export const getAllMembers = async () => {
  const params: RESTGetAPIGuildMembersQuery = {
    limit: 1000,
  };
  const url = new URL(`${discordApiBaseUrl}/guilds/${guildId}/members`);

  Object.keys(params).forEach((key) =>
    url.searchParams.append(
      key,
      params[key as keyof RESTGetAPIGuildMembersQuery] as string
    )
  );

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN as string}`,
      },
    });
    const data = (await res.json()) as APIGuildMember[];

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
