import { type User, type Key } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { type APIRole, type APIGuildMember } from "discord-api-types/v10";
import DiscordRole from "../DiscordRole";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export interface UserKeys extends User {
  keys?: Key[];
}

export interface MemberUserKeys extends APIGuildMember {
  localuser?: UserKeys;
  roleDetails?: APIRole[];
}

export const columns: ColumnDef<MemberUserKeys>[] = [
  {
    cell: ({ row }) =>
      row.original.nick ?? row.original.user?.username ?? "Unknown",
    header: "Name",
  },
  {
    cell: ({ row }) =>
      row.original.localuser?.keys?.map((key) => key.rfid).join(", "),
    header: "RFID Keys",
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
