"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/Dialog";
import ManageMachines from "./forms/ManageMachines";
import { Pencil } from "lucide-react";
import { Button } from "./ui/Button";
import { type Machine } from "@prisma/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

interface EditMachineDialogProps {
  machine?: Machine;
  buttonText?: string;
}

const EditMachineDialog = ({ machine, buttonText }: EditMachineDialogProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          {buttonText ?? <Pencil className="h-4 w-4" />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Machine</DialogTitle>
          <DialogDescription></DialogDescription>
          <QueryClientProvider client={queryClient}>
            <ManageMachines machine={machine} setOpen={setOpen} />
          </QueryClientProvider>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditMachineDialog;
