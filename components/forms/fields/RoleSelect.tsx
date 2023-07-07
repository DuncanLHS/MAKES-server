import DiscordRole from "@/components/DiscordRole";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/Select";
import { ScrollArea } from "@ui/ScrollArea";
import { type APIRole } from "discord-api-types/v10";

interface RoleSelectProps {
  onChange: (roleId: string) => void;
  options: APIRole[];
  value: string | undefined;
}

export const RoleSelect = ({ onChange, options, value }: RoleSelectProps) => {
  return (
    <Select
      onValueChange={(value) => {
        onChange(value);
      }}
      value={value}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a discord role">
          {value ? (
            <DiscordRole
              role={
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                options.filter((guildRole) => {
                  return guildRole.id === value;
                })[0]!
              }
            />
          ) : (
            "Select a discord role"
          )}
        </SelectValue>
      </SelectTrigger>
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

export default RoleSelect;
