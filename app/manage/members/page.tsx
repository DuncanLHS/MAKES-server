import { type APIGuildMember } from "discord-api-types/v10";
import React from "react";

const getMembers = async () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const res = await fetch(`${process.env.API_URL!}/api/discord/members`);
  const data = (await res.json()) as APIGuildMember[];
  return data;
};

const page = async () => {
  return <pre>MemberData: {JSON.stringify(await getMembers(), null, 2)}</pre>;
};

export default page;
