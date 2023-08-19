"use client";
import { Trash2 } from "lucide-react";
import React, { useEffect } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { type Row } from "@tanstack/react-table";
import { type MachineWithRoles } from "./machines/MachinesColmns";
import { useDeleteMachine } from "@/hooks";
import { toast } from "./ui/UseToast";

interface DeleteMachineProps {
  row: Row<MachineWithRoles>;
}

const DeleteMachine = ({ row }: DeleteMachineProps) => {
  const [open, setOpen] = React.useState(false);
  const deleteMachine = useDeleteMachine();
  const { mutate, isError, error, isSuccess, isLoading } = deleteMachine;
  const onConfirm = () => {
    mutate({ id: row.original.id });
  };

  useEffect(() => {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    if (isError) {
      toast({
        title: `Error deleting ${row.original.name}`,
        description: errMessage,
      });
    }
  }, [error, isError, isLoading, row.original.name]);

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: `Deleted ${row.original.name}`,
      });
      setOpen(false);
    }
  }, [isError, isLoading, isSuccess, row.original.name]);

  return (
    <ConfirmDialog
      title={`Are you sure you want to delete ${row.original.name}`}
      description="This cannot be undone and all access to the machine will be revoked"
      triggerIcon={<Trash2 className="h-4 w-4" />}
      triggerClassName="bg-destructive"
      confirmText="Delete"
      confirmVariant={"destructive"}
      onConfirm={onConfirm}
      open={open}
      setOpen={setOpen}
    />
  );
};

export default DeleteMachine;
