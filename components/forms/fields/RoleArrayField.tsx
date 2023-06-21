import { useGuildRoles } from "@/hooks";
import { useState } from "react";
import { FormDescription, FormItem, FormLabel, FormMessage } from "../Form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/Table";
import DiscordRole from "@/components/DiscordRole";
import { Button } from "@ui/Button";
import { Skeleton } from "@ui/Skeleton";
import { Trash2 } from "lucide-react";
import { RoleSelect } from "./RoleSelect";

interface RoleArrayFieldProps {
  value: string[];
  onChange: (roleIds: string[]) => void;
  header: string;
  description?: string;
}

const RoleArrayField = ({
  value,
  onChange,
  header,
  description,
}: RoleArrayFieldProps) => {
  const [selectValue, setSelectValue] = useState(undefined);
  const guildRoles = useGuildRoles();

  const onSelect = (roleId: string) => {
    value.push(roleId);
    onChange(value);
    setSelectValue(undefined);
  };

  const onRemove = (roleId: string) => {
    value.splice(value.indexOf(roleId), 1);
    onChange(value);
  };

  return (
    <FormItem>
      <Table className="w-full max-w-sm">
        <TableHeader>
          <TableRow>
            <TableHead>{header}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!value || !guildRoles.data ? (
            <TableRow>
              <TableCell className="flex items-center justify-between p-2">
                <Skeleton className="h-6 w-1/2 rounded-full" />
                <Skeleton className="h-9 w-12" />
              </TableCell>
            </TableRow>
          ) : (
            value.map((role) => (
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
                      <Trash2 className="aspect-auto h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
          <TableRow>
            <TableCell>
              <FormLabel>Add a Role:</FormLabel>

              {!value || !guildRoles.data ? (
                <div className="flex justify-between">
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-10 w-1/5" />
                </div>
              ) : (
                <RoleSelect
                  onChange={onSelect}
                  options={guildRoles.data.filter((role) => {
                    return !value.includes(role.id);
                  })}
                  value={selectValue}
                />
              )}
              <FormMessage />
              <FormDescription>{description}</FormDescription>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </FormItem>
  );
};

export default RoleArrayField;
