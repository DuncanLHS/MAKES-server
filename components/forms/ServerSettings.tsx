import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "./Form";
import { z } from "zod";
import { Button } from "../ui/Button";
import { type Server } from "@prisma/client";
import RoleArrayField from "./fields/RoleArrayField";
import { useServerMutation } from "@/hooks";
import { useEffect } from "react";
import { toast } from "../ui/UseToast";

const FormSchema = z.object({
  adminRoleIds: z
    .string()
    .array()
    .min(1, { message: "Must have at least one admin role" }),
  userRoleIds: z
    .string()
    .array()
    .min(1, { message: "Must have at least one admin role" }),
});

interface ServerSettingsFormProps {
  server: Server;
}

export default function ServerSettingsForm({
  server,
}: ServerSettingsFormProps) {
  const serverMutate = useServerMutation();
  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: server,
    resolver: zodResolver(FormSchema),
  });

  useEffect(() => {
    if (serverMutate.isSuccess) {
      toast({
        title: "Server settings successfully updated",
      });
      form.reset(serverMutate.data);
    }
    if (serverMutate.isError) {
      toast({
        title: "Error updating server settings",
        description: serverMutate.error as string,
      });
      console.error(serverMutate.error);
    }
  }, [
    form,
    serverMutate.error,
    serverMutate.isSuccess,
    serverMutate.isError,
    serverMutate.data,
  ]);

  const onSubmit = (values: z.infer<typeof FormSchema>) =>
    serverMutate.mutate({ id: server.id, ...values });

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
            name="userRoleIds"
            render={({ field: { value, onChange }, fieldState, formState }) => (
              <RoleArrayField
                value={value}
                onChange={onChange}
                header="User Roles"
                description="User roles allow login to this server for profile viewing only. Members must hold one of these roles for machine or door access."
              />
            )}
          />
          <FormField
            control={form.control}
            name="adminRoleIds"
            render={({ field: { value, onChange }, fieldState, formState }) => (
              <RoleArrayField
                value={value}
                onChange={onChange}
                header="Admin Roles"
                description="Admin roles can access the 'Manage' menu and change server settings. They do not grant access to machines or doors."
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
