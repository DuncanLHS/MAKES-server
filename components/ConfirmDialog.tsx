import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/Dialog";
import { Button, type buttonVariants } from "./ui/Button";
import { type VariantProps } from "class-variance-authority";

interface ConfirmDialogProps {
  triggerIcon: React.ReactNode;
  triggerClassName?: string;
  confirmText?: string;
  confirmVariant?: VariantProps<typeof buttonVariants>["variant"];
  cancelText?: string;
  cancelVariant?: VariantProps<typeof buttonVariants>["variant"];
  title: string;
  description?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  children?: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteMachineDialog = ({
  open,
  setOpen,
  triggerIcon,
  triggerClassName,
  confirmText,
  confirmVariant,
  cancelText,
  cancelVariant,
  title,
  description,
  onConfirm,
  onCancel,
  children,
}: ConfirmDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={triggerClassName}
          onClick={() => setOpen(true)}
        >
          {triggerIcon}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          {children}
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button
            variant={cancelVariant}
            onClick={() => {
              onCancel?.();
            }}
          >
            {cancelText ?? "Cancel"}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={() => {
              onConfirm?.();
            }}
          >
            {confirmText ?? "Confirm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMachineDialog;
