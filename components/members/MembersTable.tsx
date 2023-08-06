"use client";

import { DataTable } from "@ui/DataTable";
import { type MemberUserKeys, columns } from "./MembersColmns";

interface MembersTableProps {
  data: MemberUserKeys[];
}

const MembersTable = ({ data }: MembersTableProps) => {
  return <DataTable columns={columns} data={data} />;
};

export default MembersTable;
