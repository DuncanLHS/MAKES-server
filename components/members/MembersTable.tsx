"use client";

import { DataTable } from "@ui/DataTable";
import { type MemberUserKeys, columns } from "./MembersColmns";

interface MembersTableProps {
  data: MemberUserKeys[];
}

const MembersTable = ({ data }: MembersTableProps) => {
  console.log("members table");
  return <DataTable columns={columns} data={data} />;
};

export default MembersTable;
