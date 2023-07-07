import { prisma } from "@/prisma/db";
import { DataTable } from "@ui/DataTable";
import { columns } from "./MembersColmns";
import { getAllMembers } from "@/lib/discord";

const getUsersKeys = async () => {
  return await prisma.user.findMany({
    include: {
      keys: true,
    },
  });
};

const data = async () => {
  const members = await getAllMembers();
  const users = await getUsersKeys();

  if (!members || !users) {
    return [];
  }

  return members.map((member) => {
    const user = users.find((user) => user.id === member.user?.id);

    return {
      ...member,
      localuser: user,
    };
  });
};

const MembersTable = async () => {
  const tableData = await data();
  return <DataTable columns={columns} data={tableData} />;
};

export default MembersTable;
