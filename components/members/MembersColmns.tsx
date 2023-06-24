"use client";

import { type User, type Key } from "@prisma/client";
import { type AccessorFnColumnDef } from "@tanstack/react-table";
import { type APIGuildMember } from "discord-api-types/v10";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export interface UserKeys extends User {
  keys?: Key[];
}

export interface MemberUserKeys extends APIGuildMember {
  localuser?: UserKeys;
}

export const columns: AccessorFnColumnDef<MemberUserKeys>[] = [
  {
    accessorFn: (row) => row.nick ?? row.user?.username ?? "Unknown",
    header: "Name",
  },
  {
    accessorFn: (row) => row.localuser?.keys?.map((key) => key.rfid).join(", "),
    header: "RFID Keys",
  },
  {
    accessorFn: (row) => row.roles.map((role) => role).join(", "),
    header: "Roles",
  },
];
