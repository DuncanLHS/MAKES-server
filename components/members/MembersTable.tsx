import { prisma } from "@/prisma/db";
import { type APIGuildMember } from "discord-api-types/v10";
import { DataTable } from "@ui/DataTable";
import { columns } from "./MembersColmns";

const getMembers = async () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const res = await fetch(`${process.env.API_URL!}/api/discord/members`);
  const data = (await res.json()) as APIGuildMember[];

  return data;
};

const getUsersKeys = async () => {
  return await prisma.user.findMany({
    include: {
      keys: true,
    },
  });
};

const data = async () => {
  const members = await getMembers();
  const users = await getUsersKeys();

  return members.map((member) => {
    const user = users.find((user) => user.id === member.user?.id);

    return {
      ...member,
      localuser: user,
    };
  });
};

const MembersTable = async () => {
  return <DataTable columns={columns} data={await data()} />;
};

export default MembersTable;
