import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "./Form";
import { z } from "zod";
import { Button } from "../ui/Button";
import { type Machine } from "@prisma/client";
import RoleArrayField from "./fields/RoleArrayField";
import { useUpdateMachine } from "@/hooks";
import { useEffect } from "react";
import { toast } from "../ui/UseToast";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import ReadOnlyCopy from "../ui/ReadOnlyCopy";
import { v4 as uuidv4 } from "uuid";

const FormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Name must be at least 1 character" }),
  accessRoles: z
    .string()
    .array()
    .min(1, { message: "Must have at least one access role" }),
  inductorRoles: z
    .string()
    .array()
    .min(1, { message: "Must have at least one inductor role" }),
});

interface MachineSettingsFormProps {
  machine?: Machine;
  setOpen: (open: boolean) => void;
}

export default function MachineSettingsForm({
  machine,
  setOpen,
}: MachineSettingsFormProps) {
  const machineMutate = useUpdateMachine();

  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      id: machine?.id ?? uuidv4(),
      name: machine?.name ?? "",
      accessRoles: machine?.accessRoles ?? [],
      inductorRoles: machine?.inductorRoles ?? [],
    },
    resolver: zodResolver(FormSchema),
  });

  useEffect(() => {
    if (machineMutate.isSuccess) {
      toast({
        title: "Machine settings successfully updated",
      });
      form.reset(machineMutate.data);
      setOpen(false);
    }
    if (machineMutate.isError) {
      const errMessage =
        machineMutate.error instanceof Error
          ? machineMutate.error.message
          : "Unknown error";
      toast({
        title: "Error updating machine settings",
        description: errMessage,
      });
      console.log("Error: ", errMessage);
    }
  }, [
    form,
    machineMutate.error,
    machineMutate.isSuccess,
    machineMutate.isError,
    machineMutate.data,
    setOpen,
  ]);

  const onSubmit = (values: z.infer<typeof FormSchema>) =>
    machineMutate.mutate({ ...values });

  const onReset = () => form.reset();

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
        onReset={onReset}
      >
        <div className="flex flex-wrap gap-8">
          <FormField
            control={form.control}
            name="id"
            render={({ field: { value } }) => (
              <ReadOnlyCopy label="ID" text={value ?? "New Machine"} />
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Name"
                  value={value}
                  onChange={onChange}
                />
              </div>
            )}
          />
          <FormField
            control={form.control}
            name="accessRoles"
            render={({ field: { value, onChange } }) => (
              <RoleArrayField
                value={value ?? []}
                onChange={onChange}
                header="Access Roles"
                description="Access roles allow use of this machine. Members must hold one of these roles for machine access."
              />
            )}
          />
          <FormField
            control={form.control}
            name="inductorRoles"
            render={({ field: { value, onChange } }) => (
              <RoleArrayField
                value={value ?? []}
                onChange={onChange}
                header="Inductor Roles"
                description="Inductor roles must be held by someone wishing to grant an access role to another member They do not grant access to machine."
              />
            )}
          />
        </div>
        <div className="flex w-full flex-row justify-end space-x-4">
          <Button
            disabled={!form.formState.isDirty}
            type="reset"
            variant={"destructive"}
          >
            Reset
          </Button>
          <Button disabled={!form.formState.isDirty} type="submit">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
