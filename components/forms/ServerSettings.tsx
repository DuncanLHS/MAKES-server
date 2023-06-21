import { useServerQuery, useGuildRoles, useServerMutation } from "@/hooks";
import React, { useEffect } from "react";
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
import { Button } from "@ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/Table";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@ui/Select";
import { toast } from "@ui/UseToast";
import DiscordRole from "../DiscordRole";
import { type APIRole } from "discord-api-types/v10";
import { Trash2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Skeleton } from "@ui/Skeleton";
import { ScrollArea } from "@ui/ScrollArea";

const FormSchema = z.object({
  id: z.string(),
  adminRoleIds: z.string().array(),
});

const ServerSettingsNew = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const serverQuery = useServerQuery();
  const { mutate, isSuccess, error } = useServerMutation();
  const guildRoles = useGuildRoles();

  useEffect(() => {
    if (!serverQuery.data) {
      return;
    }
    form.reset(serverQuery.data);
  }, [form, serverQuery.data]);

  useEffect(() => {
    if (error) {
      toast({
        title: "An error occurred.",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        description: error.toString(),
      });
      return;
    } else if (isSuccess) {
      toast({
        title: "Server updated",
      });
    }
  }, [error, isSuccess]);

  const onSelect = (value: string) => {
    form.setValue("adminRoleIds", [...form.getValues("adminRoleIds"), value], {
      shouldDirty: true,
    });
  };

  const onRemove = (data: string) => {
    const newRoles = form.getValues("adminRoleIds").filter((id) => id !== data);
    form.setValue("adminRoleIds", newRoles, {
      shouldDirty: true,
    });
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    mutate(data);
  }

  function onReset() {
    form.reset(serverQuery.data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
        onReset={() => onReset()}
        className="w-full space-y-6"
      >
        <FormField
          control={form.control}
          name="adminRoleIds"
          render={({ field, fieldState, formState }) => (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admin Roles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!serverQuery.data || !guildRoles.data || !field.value ? (
                  <TableRow>
                    <TableCell className="flex items-center justify-between">
                      <Skeleton className="h-6 w-1/2 rounded-full" />
                      <Skeleton className="h-9 w-12" />
                    </TableCell>
                  </TableRow>
                ) : (
                  field.value.map((role) => (
                    <TableRow key={role}>
                      <TableCell className="p-2">
                        <div className="flex w-full flex-row items-center justify-between">
                          <DiscordRole
                            role={
                              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                              guildRoles.data.filter((guildRole) => {
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
                  ))
                )}
                <TableRow>
                  <TableCell>
                    <FormItem>
                      <FormLabel>Add a Role:</FormLabel>

                      {!guildRoles.data || !field.value ? (
                        <div className="flex justify-between">
                          <Skeleton className="h-10 w-3/4" />
                          <Skeleton className="h-10 w-1/5" />
                        </div>
                      ) : (
                        <AdminRoleIdsSelect
                          onChange={onSelect}
                          options={guildRoles.data.filter((role) => {
                            return !field.value.includes(role.id);
                          })}
                        />
                      )}
                      <FormMessage />
                      <FormDescription>
                        These roles allow full administrative access to the
                        server settings. Minimum one role is required.
                      </FormDescription>
                    </FormItem>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        />
        <div className="flex w-full flex-row justify-between">
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
        <ScrollArea className="h-48">
          {options.map((role) => (
            <SelectItem key={role.id} value={role.id}>
              <DiscordRole role={role} />
            </SelectItem>
          ))}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
};

export default ServerSettingsNew;
