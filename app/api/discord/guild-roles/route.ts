import { type APIRole } from "discord-api-types/v10";
import { NextResponse } from "next/server";

const guildId = "1071217231515615282";
const discordApiBaseUrl = "https://discord.com/api";

export async function GET() {
  try {
    const res = await fetch(`${discordApiBaseUrl}/guilds/${guildId}/roles`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN as string}`,
      },
    });
    const data = (await res.json()) as APIRole[];
    const filteredData = data.filter((role) => role.name !== "@everyone");

    filteredData.sort((a, b) => {
      if (a.name < b.name) return -1;
      else if (a.name > b.name) return 1;
      else return 0;
    });
    return NextResponse.json(filteredData);
  } catch (error) {
    return NextResponse.error();
  }
}
