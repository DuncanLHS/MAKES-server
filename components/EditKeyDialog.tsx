import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/Dialog";
import { Pencil } from "lucide-react";
import ManageKeys from "./forms/ManageKeys";
import { Button } from "./ui/Button";
import { type MemberUserKeys } from "./members/MembersColmns";

interface EditKeyDialogProps {
  member: MemberUserKeys;
}

const EditKeyDialog = ({ member }: EditKeyDialogProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Key</DialogTitle>
          <DialogDescription>
            PROCEED WITH CAUTION! To avoid errors, this should be performed by
            the bot and not manually edited.
          </DialogDescription>

          <ManageKeys member={member} setOpen={setOpen} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditKeyDialog;
