import MembersTable from "@/components/members/MembersTable";
import { prisma } from "@/prisma/db";
import React from "react";
import { getAllMembers, getServerRoles } from "@/lib/discord";
import { type MemberUserKeys } from "@/components/members/MembersColmns";

const data = async () => {
  const serverRoles = await getServerRoles();
  const members = await getAllMembers();
  const users = await prisma.user.findMany({
    include: {
      keys: true,
    },
  });

  if (!members || !users || !serverRoles) {
    return [];
  }

  return members.map((member) => {
    const user = users.find((user) => user.id === member.user?.id);

    return {
      ...member,
      localuser: user,
      roleDetails: serverRoles?.filter((role) =>
        member.roles.includes(role.id)
      ),
    };
  }) as MemberUserKeys[];
};

const page = async () => {
  const tableData = await data();
  return (
    <main className="mx-auto flex h-screen max-w-6xl flex-grow flex-col p-4">
      <h1 className="mb-4 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Members
      </h1>
      <section className="flex flex-wrap gap-4">
        <MembersTable data={tableData} />
      </section>
    </main>
  );
};

export default page;
