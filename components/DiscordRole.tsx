import { type APIRole } from "discord-api-types/v10";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

interface DiscordRoleProps {
  className?: string;
  role: APIRole | undefined;
}

const DiscordRole = ({ role, className }: DiscordRoleProps) => {
  if (!role) {
    return (
      <Badge
        variant={"default"}
        className={cn("max-h-6 border-red-700 text-sm text-red-700", className)}
      >
        Unknown Role
      </Badge>
    );
  }
  const bgColor: string | null =
    role.color !== 0 ? `#${role.color.toString(16).padStart(6, "0")}` : null;
  return (
    <Badge
      variant={"default"}
      className={cn("max-h-6 gap-2 text-sm", className)}
    >
      <span
        className="inline-block h-3 w-3 rounded-full"
        style={bgColor ? { backgroundColor: `${bgColor}` } : {}}
      />
      {role.name}
    </Badge>
  );
};

export default DiscordRole;
