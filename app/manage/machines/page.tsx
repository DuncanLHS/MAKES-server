import { prisma } from "@/prisma/db";
import React from "react";

import MachinesTable from "@/components/machines/MachinesTable";
import { getServerRoles } from "@/lib/discord";
import EditMachineDialog from "@/components/EditMachineDialog";

const data = async () => {
  const roles = await getServerRoles();
  const machines = await prisma.machine.findMany();
  if (!roles || !machines) {
    return [];
  }

  const machinesWithRoles = machines.map((machine) => {
    const accessRoles = machine.accessRoles.map((role) => {
      const fullRole = roles.find((r) => r.id === role);
      return fullRole ?? undefined;
    });
    const inductorRoles = machine.inductorRoles.map((role) => {
      const fullRole = roles.find((r) => r.id === role);
      return fullRole ?? undefined;
    });

    return {
      ...machine,
      accessRoles,
      inductorRoles,
    };
  });

  return machinesWithRoles;
};

const page = async () => {
  const tableData = await data();
  return (
    <main className="mx-auto flex h-screen max-w-6xl flex-grow flex-col p-4">
      <div className="flex flex-row justify-between">
        <h1 className="mb-4 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Machines
        </h1>
        <EditMachineDialog buttonText="New Machine" />
      </div>
      <section className="flex flex-wrap gap-4">
        <MachinesTable data={tableData} />
      </section>
    </main>
  );
};

export default page;
