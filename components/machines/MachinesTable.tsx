"use client";

import { DataTable } from "@ui/DataTable";
import { type MachineWithRoles, columns } from "./MachinesColmns";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

interface MachinesTableProps {
  data: MachineWithRoles[];
}

const MachinesTable = ({ data }: MachinesTableProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <DataTable columns={columns} data={data} />
    </QueryClientProvider>
  );
};

export default MachinesTable;
