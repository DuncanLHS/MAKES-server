"use client";

import { DataTable } from "@ui/DataTable";
import { type MachineWithRoles, columns } from "./MachinesColmns";

interface MachinesTableProps {
  data: MachineWithRoles[];
}

const MachinesTable = ({ data }: MachinesTableProps) => {
  return <DataTable columns={columns} data={data} />;
};

export default MachinesTable;
