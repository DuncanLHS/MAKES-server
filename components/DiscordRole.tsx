import { type APIRole } from "discord-api-types/v10";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

interface DiscordRoleProps {
  className?: string;
  role: APIRole;
}

const DiscordRole = ({ role, className }: DiscordRoleProps) => {
  const bgColor: string | null =
    role.color !== 0 ? `#${role.color.toString(16).padStart(6, "0")}` : null;
  console.log(role.name, role.color, bgColor);
  return (
    <Badge
      variant={"default"}
      className={cn("text-sm", className)}
      style={{ backgroundColor: `${bgColor ?? "#ffffff"}` }}
    >
      {role.name}
    </Badge>
  );
};

export default DiscordRole;
