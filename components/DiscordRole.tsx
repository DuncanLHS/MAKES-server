import { type APIRole } from "discord-api-types/v10";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

interface DiscordRoleProps {
  className?: string;
  role: APIRole;
}

const DiscordRole = ({ role, className }: DiscordRoleProps) => {
  const bgColor: string =
    role.color !== 0 ? `bg-[#${role.color.toString(16)}]` : "bg-primary";
  return (
    <Badge
      id={role.id}
      variant={"default"}
      className={cn("text-sm", bgColor, className)}
    >
      {role.name}
    </Badge>
  );
};

export default DiscordRole;
