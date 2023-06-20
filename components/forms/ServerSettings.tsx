import { useServer, useGuildRoles } from "@/hooks";
import React from "react";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./Form";
import { Button } from "../ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/Table";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../ui/Select";
import { toast } from "../ui/UseToast";
import DiscordRole from "../DiscordRole";
import { type APIRole } from "discord-api-types/v10";
import { Trash2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const FormSchema = z.object({
  adminRoleIds: z.string().array(),
});

const ServerSettingsNew = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { isLoading: serverLoading, error, data: server } = useServer();
  const {
    isLoading: guidRolesLoading,
    error: guildRolesErr,
    data: guildRoles,
  } = useGuildRoles();

  if (!guildRoles || !server) {
    return null;
  }

  form.setValue("adminRoleIds", server.adminRoleIds);

  const onSelect = (data: string) => {
    const selectedRole = guildRoles.find((role) => role.id === data);
    if (!selectedRole) {
      console.log("no role found");
      return;
    }
    form.setValue("adminRoleIds", [...form.getValues("adminRoleIds"), data], {
      shouldDirty: true,
    });
    toast({
      title: "You selected the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    console.log(form.getValues("adminRoleIds"));
  };

  const onRemove = (data: string) => {
    const selectedRole = guildRoles.find((role) => role.id === data);
    if (!selectedRole) {
      console.log("no role found");
      return;
    }
    const newRoles = form.getValues("adminRoleIds").filter((id) => id !== data);
    form.setValue("adminRoleIds", newRoles);
    toast({
      title: "You removed the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    console.log(form.getValues("adminRoleIds"));
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
        className="w-full space-y-6"
      >
        <FormField
          control={form.control}
          name="adminRoleIds"
          render={({ field, fieldState, formState }) => (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Admin Roles</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {field.value.map((role) => (
                    <TableRow key={role}>
                      <TableCell className="p-2">
                        <div className="flex w-full flex-row items-center justify-between">
                          <DiscordRole
                            role={
                              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                              guildRoles.filter((guildRole) => {
                                return guildRole.id === role;
                              })[0]!
                            }
                          />
                          <Button
                            onClick={() => onRemove(role)}
                            variant={"ghost"}
                            size={"sm"}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell>
                      <FormItem>
                        <FormLabel>Add a Role:</FormLabel>

                        <AdminRoleIdsSelect
                          onChange={onSelect}
                          options={guildRoles.filter((role) => {
                            return !field.value.includes(role.id);
                          })}
                        />
                        <FormMessage />
                        <FormDescription>
                          These roles add full administrative access to the
                          server settings.
                        </FormDescription>
                      </FormItem>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </>
          )}
        />
        <Button disabled={!form.formState.isDirty} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};

interface AdminRoleIdsSelectProps {
  onChange: (...event: any[]) => void;
  options: APIRole[];
}

const AdminRoleIdsSelect = ({ onChange, options }: AdminRoleIdsSelectProps) => {
  return (
    <Select
      onValueChange={(value) => {
        onChange(value);
      }}
    >
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder="Select a discord role" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {options.map((role) => (
          <SelectItem key={role.id} value={role.id}>
            <DiscordRole role={role} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ServerSettingsNew;
