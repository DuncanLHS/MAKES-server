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

    return NextResponse.json(sorted);
  } catch (error) {
    return NextResponse.error();
  }
}
