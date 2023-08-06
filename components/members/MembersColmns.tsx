"use client";

import { type Key } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { type APIRole, type APIGuildMember } from "discord-api-types/v10";
import DiscordRole from "../DiscordRole";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EditKeyDialog from "../EditKeyDialog";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
const queryClient = new QueryClient();

export interface MemberUserKeys extends APIGuildMember {
  key?: Key;
  roleDetails?: APIRole[];
}

export const columns: ColumnDef<MemberUserKeys>[] = [
  {
    cell: ({ row }) =>
      row.original.nick ?? row.original.user?.username ?? "Unknown",
    header: "Name",
  },
  {
    cell: ({ row }) => {
      return (
        <QueryClientProvider client={queryClient}>
          <div className="flex flex-row justify-between">
            {row.original.key ? (
              <p className="mx-2">{row.original.key.rfid}</p>
            ) : (
              <p className="mx-2 italic text-muted-foreground">No key</p>
            )}
            <EditKeyDialog member={row.original} />
          </div>
        </QueryClientProvider>
      );
    },
    header: "RFID Key",
  },
  {
    header: "Roles",
    cell: ({ row }) => {
      return (
        <div className={"flex flex-wrap gap-2"}>
          {row.original.roleDetails?.map((role) => (
            <DiscordRole role={role} key={role.id} className="block" />
          ))}
        </div>
      );
    },
  },
];
