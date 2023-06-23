// api route to return list of discord members

import {
  type RESTGetAPIGuildMembersQuery,
  type APIGuildMember,
} from "discord-api-types/v10";
import { NextResponse } from "next/server";

const guildId = "1071217231515615282";

export async function GET() {
  const params: RESTGetAPIGuildMembersQuery = {
    limit: 1000,
  };
  const url = new URL(`https://discord.com/api/guilds/${guildId}/members`);

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

    data.filter((member) => member.user?.bot !== true);

    data.sort((a, b) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if ((a.nick ?? a.user!.username) < (b.nick ?? b.user!.username))
        return -1;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      else if ((a.nick ?? a.user!.username) > (b.nick ?? b.user!.username))
        return 1;
      else return 0;
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.error();
  }
}
