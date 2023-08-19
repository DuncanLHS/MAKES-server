"use client";

import { type Machine } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import DiscordRole from "../DiscordRole";
import { type APIRole } from "discord-api-types/v10";
import EditMachineDialog from "../EditMachineDialog";
import DeleteMachine from "../DeleteMachine";

export type MachineWithRoles = Omit<
  Machine,
  "accessRoles" | "inductorRoles"
> & {
  accessRoles: (APIRole | undefined)[];
  inductorRoles: (APIRole | undefined)[];
};

const stripRoles = (machine: MachineWithRoles): Machine => {
  return {
    ...machine,
    accessRoles: machine.accessRoles.reduce((acc: string[], role) => {
      if (role) acc.push(role.id);
      return acc;
    }, []),
    inductorRoles: machine.inductorRoles.reduce((acc: string[], role) => {
      if (role) acc.push(role.id);
      return acc;
    }, []),
  };
};

export const columns: ColumnDef<MachineWithRoles>[] = [
  {
    cell: ({ row }) => row.original.name,
    header: "Name",
  },
  {
    header: "Access Roles",
    cell: ({ row }) => {
      return (
        <div className={"flex flex-wrap gap-2"}>
          {row.original.accessRoles.map((role, i) => (
            <DiscordRole role={role} key={role?.id ?? i} className="block" />
          ))}
        </div>
      );
    },
  },
  {
    header: "Inductor Roles",
    cell: ({ row }) => {
      return (
        <div className={"flex flex-wrap gap-2"}>
          {row.original.inductorRoles.map((role, i) => (
            <DiscordRole role={role} key={role?.id ?? i} className="block" />
          ))}
        </div>
      );
    },
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      return (
        <span className="flex gap-2">
          <EditMachineDialog machine={stripRoles(row.original)} />
          <DeleteMachine row={row} />
        </span>
      );
    },
  },
];
